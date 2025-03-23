// Generate a random 40-character secret key
function generateSecretKey() {
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    for (let i = 0; i < 40; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}

// SHA-256 Hash Function
async function sha256Encrypt(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// Sign Up Function
async function signUp(email) {
    if (!email.includes("@")) {
        alert("Invalid email!");
        return;
    }

    const secretKey = generateSecretKey();  // Generate secret key
    const hashedSecretKey = await sha256Encrypt(secretKey); // Hash before storing

    try {
        await db.collection("users").doc(email).set({ secretKey: hashedSecretKey });
        alert(`Sign up successful! Your secret key:\n${secretKey}\nSave it securely!`);
    } catch (error) {
        alert("Error signing up: " + error.message);
    }
}

// Login Function
async function login(email, secretKey) {
    const userRef = db.collection("users").doc(email);
    const doc = await userRef.get();

    if (!doc.exists) {
        alert("No account found with this email.");
        return;
    }

    const hashedInputKey = await sha256Encrypt(secretKey); // Hash input key to compare
    if (doc.data().secretKey !== hashedInputKey) {
        alert("Incorrect secret key.");
        return;
    }

    alert("Login successful!");
    localStorage.setItem("currentUser", email);
    location.reload();
}

// Logout
function logout() {
    localStorage.removeItem("currentUser");
    alert("Logged out!");
    location.reload();
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem("currentUser") !== null;
}

// Display user info
function showUserInfo() {
    let email = localStorage.getItem("currentUser");
    if (!email) return;

    document.getElementById("userInfo").innerText = `Logged in as: ${email}`;
}
