import crypto from "crypto";
import contentfulClient from "./contentfulClient";

export async function loginUser(email: string, password: string) {
  try {
    const users = await contentfulClient.getEntries({
      content_type: "user",
      "fields.email": email,
      limit: 1,
    });

    if (users.items.length === 0) {
      return null; // korisnik nije pronađen
    }

    const user = users.items[0];
    const storedHash = user.fields.password;

    if (typeof storedHash !== "string" || !storedHash) {
      return null;
    }

    // Računanje MD5 hasha za unesenu lozinku
    const md5Hash = crypto.createHash("md5").update(password).digest("hex");

    if (md5Hash === storedHash) {
      // Login uspješan — vrati podatke korisnika koje želite
      return {
        id: user.sys.id,
        email: user.fields.email,
        fullName: user.fields.fullName,
      };
    } else {
      return null; // neispravna lozinka
    }
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}
