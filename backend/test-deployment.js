fetch("http://localhost:5000/api/deployments", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        version: "1.0.0",
        environment: "Local",
        status: "SUCCESS"
    })
})
.then(response => response.json())
.then(data => {
    console.log("Deployment created:");
    console.log(data);
})
.catch(error => {
    console.error("Error:", error);
});