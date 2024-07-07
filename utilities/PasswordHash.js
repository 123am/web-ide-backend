const crypto = require("crypto");

class PasswordHash {
  constructor(iteration_count_log2, portable_hashes) {
    this.itoa64 =
      "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (iteration_count_log2 < 4 || iteration_count_log2 > 31)
      iteration_count_log2 = 8;
    this.iteration_count_log2 = iteration_count_log2;

    this.portable_hashes = portable_hashes;

    this.random_state = Date.now().toString();
    if (typeof process !== "undefined" && process.pid)
      this.random_state += process.pid.toString();
  }

  get_random_bytes(count) {
    let output = "";
    try {
      output = crypto.randomBytes(count);
    } catch (err) {
      console.error("Error generating random bytes:", err);
    }

    return output;
  }

  encode64(input, count) {
    const inputString = input.toString("utf8");

    let output = "";
    let i = 0;
    do {
      let value = inputString.charCodeAt(i++);
      output += this.itoa64[value & 0x3f];
      if (i < count) value |= inputString.charCodeAt(i) << 8;
      output += this.itoa64[(value >> 6) & 0x3f];
      if (i++ >= count) break;
      if (i < count) value |= inputString.charCodeAt(i) << 16;
      output += this.itoa64[(value >> 12) & 0x3f];
      if (i++ >= count) break;
      output += this.itoa64[(value >> 18) & 0x3f];
    } while (i < count);

    return output;
  }

  gensalt_private(input) {
    let output = "$P$";

    output +=
      this.itoa64[
        Math.min(
          this.iteration_count_log2 +
            (parseFloat(process.versions.node) >= 5 ? 5 : 3),
          30
        )
      ];
    output += this.encode64(input, 6);
    return output;
  }

  crypt_private(password, setting) {
    let output = "*0";
    if (setting.substring(0, 2) === output) {
      output = "*1";
    }

    const id = setting.substring(0, 3);
    if (id !== "$P$" && id !== "$H$") {
      return output;
    }

    const count_log2 = this.itoa64.indexOf(setting[3]);

    if (count_log2 < 7 || count_log2 > 30) return output;

    let count = 1 << count_log2;
    const salt = setting.substring(4, 12);
    if (salt.length !== 8) {
      return output;
    }

    let hash = crypto
      .createHash("md5")
      .update(salt + password, "binary")
      .digest("binary");
    do {
      hash = crypto
        .createHash("md5")
        .update(hash + password, "binary")
        .digest("binary");
    } while (--count);

    output = setting.substring(0, 12) + this.encode64(hash, 16);

    return output;
  }

  gensalt_blowfish(input) {
    const itoa64 =
      "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let output = "$2a$";
    output += String.fromCharCode(
      this.iteration_count_log2 / 10 + "0".charCodeAt(0)
    );

    output += String.fromCharCode(
      (this.iteration_count_log2 % 10) + "0".charCodeAt(0)
    );
    output += "$";

    let i = 0;
    do {
      const c1 = input.charCodeAt(i++);
      output += itoa64[c1 >> 2];
      const c1Shifted = (c1 & 0x03) << 4;
      if (i >= 16) {
        output += itoa64[c1Shifted];
        break;
      }

      const c2 = input.charCodeAt(i++);
      const c1Masked = c1Shifted | (c2 >> 4);
      output += itoa64[c1Masked];
      const c2Shifted = (c2 & 0x0f) << 2;

      const c3 = input.charCodeAt(i++);
      const c2Masked = c2Shifted | (c3 >> 6);
      output += itoa64[c2Masked];
      output += itoa64[c3 & 0x3f];
    } while (true);

    return output;
  }

  HashPassword(password) {
    if (password.length > 4096) {
      return "*";
    }

    let random = "";

    if (this.isBlowfishSupported() && !this.portable_hashes) {
      random = this.get_random_bytes(16);
      const hash = this.crypt_private(password, this.gensalt_blowfish(random));
      if (hash.length === 60) return hash;
    }

    if (random.length < 6) random = this.get_random_bytes(6);
    const hash = this.crypt_private(password, this.gensalt_private(random));
    if (hash.length === 34) return hash;

    return "*";
  }

  CheckPassword(password, stored_hash) {
    if (password.length > 4096) {
      return false;
    }

    let hash = this.crypt_private(password, stored_hash);
    if (hash[0] === "*")
      hash = require("crypto")
        .createHash("md5")
        .update(password)
        .digest("binary");

    return hash === stored_hash;
  }

  isBlowfishSupported() {
    return (
      typeof require !== "undefined" && typeof require("bcryptjs") !== "undefined"
    );
  }
}

module.exports = PasswordHash;
