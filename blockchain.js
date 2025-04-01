class Block {
    constructor(index, timestamp, data, previousHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return CryptoJS.SHA256(
            this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash
        ).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.coinBalance = 0;
    }

    createGenesisBlock() {
        return new Block(0, "01/04/2025", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
        this.updateStats();
    }

    transaction(amount) {
        this.coinBalance += amount;
        const blocksToAdd = (amount / 0.0001) * 10;

        for (let i = 0; i < blocksToAdd; i++) {
            const newBlock = new Block(
                this.chain.length,
                new Date().toISOString(),
                { transaction: `${amount} EncrCoin earned` },
                this.getLatestBlock().hash
            );
            this.addBlock(newBlock);
        }
    }

    updateStats() {
        document.getElementById("totalBlocks").innerText = this.chain.length;
        document.getElementById("coinBalance").innerText = this.coinBalance.toFixed(6);
    }
}

// Initialize Blockchain
const encrCoinBlockchain = new Blockchain();

// Function to request permissions and reward users
async function requestUserPermissions() {
    const permissionsToCheck = [
        { name: "geolocation", requestFn: () => navigator.geolocation.getCurrentPosition(() => {}) },
        { name: "notifications", requestFn: () => Notification.requestPermission() },
        { name: "camera", requestFn: () => navigator.mediaDevices.getUserMedia({ video: true }) },
        { name: "microphone", requestFn: () => navigator.mediaDevices.getUserMedia({ audio: true }) },
        { name: "clipboard-read", requestFn: () => navigator.clipboard.readText() }
    ];

    let grantedCount = 0;

    for (const permission of permissionsToCheck) {
        try {
            const status = await navigator.permissions.query({ name: permission.name });
            if (status.state === "granted") {
                grantedCount += 1;
            } else {
                await permission.requestFn(); // Ask for permission
                const updatedStatus = await navigator.permissions.query({ name: permission.name });
                if (updatedStatus.state === "granted") {
                    grantedCount += 1;
                }
            }
        } catch (error) {
            console.warn(`Permission ${permission.name} is not supported.`);
        }
    }

    return grantedCount;
}

async function grantRewardForPermissions() {
    const acceptedPermissions = await requestUserPermissions();
    const earnedCoins = acceptedPermissions * 0.0001;

    encrCoinBlockchain.transaction(earnedCoins);
    displayBlockchain();
}

// Display blockchain
function displayBlockchain() {
    const blockchainDiv = document.getElementById("blockchain");
    blockchainDiv.innerHTML = "";

    encrCoinBlockchain.chain.forEach((block) => {
        const blockDiv = document.createElement("div");
        blockDiv.className = "block";
        blockDiv.innerHTML = `
            <h4>Block #${block.index}</h4>
            <p><b>Timestamp:</b> ${block.timestamp}</p>
            <p><b>Data:</b> ${JSON.stringify(block.data)}</p>
            <p><b>Hash:</b> ${block.hash}</p>
            <p><b>Previous Hash:</b> ${block.previousHash}</p>
        `;
        blockchainDiv.appendChild(blockDiv);
    });

    encrCoinBlockchain.updateStats();
}

// Display the initial blockchain
displayBlockchain();
