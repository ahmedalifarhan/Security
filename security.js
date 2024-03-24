// Function to convert text to binary string
function textToBinary(text) {
  let binary = "";
  for (let char of text) {
    binary += char.charCodeAt(0).toString(2).padStart(8, "0");
  }
  return binary;
}

// Function to convert binary string to text
function binaryToText(binary) {
  let text = "";
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    const value = parseInt(byte, 2);
    const character = String.fromCharCode(value);
    text += character;
  }
  return text;
}

// Function to generate keystream
function generateKeystream(key) {
  let X = Array(19).fill(0);
  let Y = Array(22).fill(0);
  let Z = Array(23).fill(0);

  let binaryKey = textToBinary(key);

  for (let i = 0; i < 19; i++) {
    X[i] = parseInt(binaryKey[i]);
  }

  for (let i = 0; i < 22; i++) {
    Y[i] = parseInt(binaryKey[19 + i]);
  }

  for (let i = 0; i < 23; i++) {
    Z[i] = parseInt(binaryKey[41 + i]);
  }

  let keystream = "";
  for (let i = 0; i < binaryKey.length; i++) {
    let m = (X[8] & Y[10]) | (X[8] & Z[10]) | (Y[10] & Z[10]);

    if (X[8] == m) {
      let t = X[13] ^ X[16] ^ X[17] ^ X[18];
      X = [t].concat(X.slice(0, 18));
    }
    if (Y[10] == m) {
      let t = Y[20] ^ Y[21];
      Y = [t].concat(Y.slice(0, 21));
    }
    if (Z[10] == m) {
      let t = Z[7] ^ Z[20] ^ Z[21] ^ Z[22];
      Z = [t].concat(Z.slice(0, 22));
    }

    keystream += String(X[18] ^ Y[21] ^ Z[22]);
  }

  return {
    keystream: keystream,
    X: X.join(""),
    Y: Y.join(""),
    Z: Z.join(""),
  };
}

// Function to encrypt plaintext
function encrypt() {
  let key = document.getElementById("key").value; // Get the encryption key from the input field
  let plaintext = document.getElementById("plaintext").value; // Get the plaintext from the input field
  let binaryPlaintext = textToBinary(plaintext); // Convert plaintext to binary

  let result = generateKeystream(key); // Generate keystream using the key
  let keystream = result.keystream; // Extract the keystream
  let X = result.X; // Extract register X
  let Y = result.Y; // Extract register Y
  let Z = result.Z; // Extract register Z

  let ciphertext = ""; // Initialize variable to store the ciphertext

  // Perform XOR operation between the binary representation of each plaintext character and the keystream bit
  // Loop through the binary plaintext, encrypting each character
  for (let i = 0; i < binaryPlaintext.length; i++) {
    ciphertext += String(
      Number(binaryPlaintext[i]) ^ Number(keystream[i % keystream.length])
    );
    // Use modulo operator to loop through the keystream if its length is shorter than plaintext's binary length
  }

  // Display the encryption result
  let output = document.getElementById("output");
  output.innerHTML = "<p>X: " + X + "</p>"; // Display register X
  output.innerHTML += "<p>Y: " + Y + "</p>"; // Display register Y
  output.innerHTML += "<p>Z: " + Z + "</p>"; // Display register Z
  output.innerHTML += "<p>Key binary: " + textToBinary(key) + "</p>"; // Display binary representation of the key
  output.innerHTML += "<p>Plain text binary: " + binaryPlaintext + "</p>"; // Display binary representation of the plaintext
  output.innerHTML += "<p>Keystream: " + keystream + "</p>"; // Display the generated keystream
  output.innerHTML += "<p>Cipher binary: " + ciphertext + "</p>"; // Display binary ciphertext
  output.innerHTML += "<p>Cipher text: " + binaryToText(ciphertext) + "</p>"; // Display ciphertext in text form

  // Decrypt ciphertext
  let decryptedText = decrypt(ciphertext, keystream); // Decrypt the ciphertext
  output.innerHTML += "<p>Decrypted: " + binaryToText(decryptedText) + "</p>"; // Display decrypted plaintext
}

// Decrypts ciphertext
function decrypt(ciphertext, keystream) {
  let decryptedText = "";
  for (let i = 0; i < ciphertext.length; i++) {
    // XOR binary representations of ciphertext character and keystream bit
    decryptedText += String(
      Number(ciphertext[i]) ^ Number(keystream[i % keystream.length])
    );
  }
  return decryptedText;
}
