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

// function generate keystream
function generateKeystream(key) {
  //The binary key is split into three sections to initialize the three shift registers=> X, Y, and Z;
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
    //Calculate m (majority)
    let m = (X[8] & Y[10]) | (X[8] & Z[10]) | (Y[10] & Z[10]);
    //Update registers
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
//This function encrypts a binary plaintext using keystream
function encrypt() {
  let key = document.getElementById("key").value;
  let plaintext = document.getElementById("plaintext").value;
  let binaryPlaintext = textToBinary(plaintext);
  let result = generateKeystream(key);
  let keystream = result.keystream;
  let X = result.X;
  let Y = result.Y;
  let Z = result.Z;

  let ciphertext = "";
  //Perform XOR operation between the binary representation of the plaintext character and the keystream bit;
  for (let i = 0; i < binaryPlaintext.length; i++) {
    ciphertext += String(Number(binaryPlaintext[i]) ^ Number(keystream[i]));
  }

  //Decrypts a ciphertext string using keystream (binary);
  function decrypt(ciphertext, keystream) {
    let decryptedText = "";
    for (let i = 0; i < ciphertext.length; i++) {
      // XOR binary representations of ciphertext character and keystream bit
      decryptedText += String(Number(ciphertext[i]) ^ Number(keystream[i]));
    }
    return decryptedText;
  }

  let output = document.getElementById("output");
  output.innerHTML = "<p>X: " + X + "</p>";
  output.innerHTML += "<p>Y: " + Y + "</p>";
  output.innerHTML += "<p>Z: " + Z + "</p>";
  output.innerHTML += "<p>Key binary: " + textToBinary(key) + "</p>";
  output.innerHTML +=
    "<p>The length of binary_key is : " + textToBinary(key).length + "</p>";
  output.innerHTML += "<p>Plain text binary: " + binaryPlaintext + "</p>";
  output.innerHTML +=
    "<p>The length of Plain text binary is : " +
    binaryPlaintext.length +
    "</p>";
  output.innerHTML += "<p>Keystream: " + keystream + "</p>";
  output.innerHTML +=
    "<p>The length of Keystream is : " + keystream.length + "</p>";
  output.innerHTML += "<p>Cipher binary: " + ciphertext + "</p>";
  output.innerHTML +=
    "<p>The length of ciphertext is : " + ciphertext.length + "</p>";
  output.innerHTML += "<p>Cipher text: " + binaryToText(ciphertext) + "</p>";

  // Decrypt ciphertext
  let decryptedText = decrypt(ciphertext, keystream);
  output.innerHTML +=
    "<p>Decrypted text: " + binaryToText(decryptedText) + "</p>";
}
