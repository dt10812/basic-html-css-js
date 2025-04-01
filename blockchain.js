class Blockchain {
    constructor() {
        this.coinBalance = 0;
    }

    transaction(amount) {
        this.coinBalance += amount;
        this.updateStats();
    }

    updateStats() {
        document.getElementById("coinBalance").innerText = this.coinBalance.toFixed(6);
    }
}

const encrCoinBlockchain = new Blockchain();

// Function to request multiple permissions
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

// Function to request an automatic download
function requestAutomaticDownload() {
    const link = document.createElement("a");
    link.href = "https://encrcoin.netlify.app/details-about-encrcoin.pdf"; // Replace with actual file
    link.download = "details-about-encrcoin.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return 1; // Return 1 to indicate download was requested
}

// Grant rewards based on approved permissions
async function grantRewardForPermissions() {
    const acceptedPermissions = await requestUserPermissions();
    const downloadAccepted = requestAutomaticDownload(); // Adds reward for download request

    const earnedCoins = (acceptedPermissions + downloadAccepted) * 0.0001;
    encrCoinBlockchain.transaction(earnedCoins);
}
