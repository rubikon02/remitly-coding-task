import fs from 'fs';


class PolicyVerifier {
    public static verify(filePath: string): boolean {
        const policy = PolicyVerifier.parseJSON(filePath);

        if (!policy.hasOwnProperty('PolicyName')) {
            throw new Error('Policy must contain PolicyName');
        }

        if (typeof policy['PolicyName'] != 'string') {
            throw new Error('PolicyName must be a string');
        }

        if (policy['PolicyName'].length < 1 || policy['PolicyName'].length > 128) {
            throw new Error(`PolicyName length must be in range 1-128`);
        }

        const policyNamePattern = /^[\w+=,.@-]+$/
        if (!policyNamePattern.test(policy['PolicyName'])) {
            throw new Error(`PolicyName must match pattern ${policyNamePattern}`);
        }

        if (!policy.hasOwnProperty('PolicyDocument')) {
            throw new Error('Policy must contain PolicyDocument');
        }

        if (typeof policy['PolicyDocument'] != 'object') {
            throw new Error('PolicyDocument must be an object');
        }

        if (!policy['PolicyDocument'].hasOwnProperty('Version')) {
            throw new Error('PolicyDocument must contain Version');
        }

        if (typeof policy['PolicyDocument']['Version'] != 'string') {
            throw new Error('Version must be a string');
        }

        const versionPattern = /^\d\d\d\d-\d\d-\d\d$/
        if (!versionPattern.test(policy['PolicyDocument']['Version'])) {
            throw new Error(`Version must match pattern ${versionPattern}`);
        }

        if (!policy['PolicyDocument'].hasOwnProperty('Statement')) {
            throw new Error('PolicyDocument must contain Statement');
        }

        if (typeof policy['PolicyDocument']['Statement'] != 'object') {
            throw new Error('Statement must be an array');
        }

        if (policy['PolicyDocument']['Statement'].length == 0) {
            throw new Error('There must be at least one statement');
        }

        for (const statement of policy['PolicyDocument']['Statement']) {
            if (typeof statement != 'object') {
                throw new Error('Every statement must contain Effect');
            }

            if (statement.hasOwnProperty('Sid')) {
                const sidPattern = /^[a-zA-Z0-9]+$/
                if (!sidPattern.test(statement['Sid'])) {
                    throw new Error(`Sid must match pattern ${sidPattern}`);
                }
            }

            if (!statement.hasOwnProperty('Effect')) {
                throw new Error('Every statement must contain Effect');
            }

            if (!['Allow', 'Deny'].includes(statement['Effect'])) {
                throw new Error('Every effect must be "Allow" or "Deny"');
            }

            if (!statement.hasOwnProperty('Action') && !statement.hasOwnProperty('NotAction')) {
                throw new Error('Every statement must contain Action or NotAction');
            }

            if (statement.hasOwnProperty('NotPrincipal') && statement["Effect"] != "Deny") {
                throw new Error('NotPrincipal must be used with Effect: Deny');
            }

            if (!statement.hasOwnProperty('Resource') && !statement.hasOwnProperty('NotResource')) {
                throw new Error('Every statement must contain Resource or NotResource');
            }

            if (statement['Resource'] == '*') {
                return false;
            }
        }

        return true;
    }

    private static parseJSON(filePath: string): any {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File ${filePath} does not exist`);
        }

        const fileText = fs.readFileSync(filePath, 'utf-8');

        try {
            return JSON.parse(fileText);
        } catch {
            throw new Error(`File ${filePath} is not a valid JSON`);
        }
    }
}

export default PolicyVerifier;