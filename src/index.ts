import PolicyVerifier from "./PolicyVerifier";


const params = process.argv.slice(2);

if (params.length != 1) {
    console.error("Pass policy file path as the only argument");
    process.exitCode = 2;
} else {
    const path = params[0];
    const isPolicyCorrect = PolicyVerifier.verify(path);

    if (isPolicyCorrect) {
        console.log("Policy is correct");
    } else {
        console.log("Policy is incorrect");
    }
}
