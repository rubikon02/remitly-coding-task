import PolicyVerifier from '../src/PolicyVerifier';
import path from 'path';


function filePath(filename: string) {
    return path.join(__dirname, 'data', filename);
}

describe('Valid policy', () => {
    it('should return false with single asterisk', () => {
        const policyPath = filePath('asterisk.json');
        expect(PolicyVerifier.verify(policyPath)).toBeFalsy();
    });

    it('should return true with multiple asterisks', () => {
        const policyPath = filePath('multipleAsterisks.json');
        expect(PolicyVerifier.verify(policyPath)).toBeTruthy();
    });

    it('should return true with no asterisks', () => {
        const policyPath = filePath('noAsterisk.json');
        expect(PolicyVerifier.verify(policyPath)).toBeTruthy();
    });
});

describe('File', () => {
    it('should exist', () => {
        const policyPath = filePath('notExistingFile.json');
        expect(() => PolicyVerifier.verify(policyPath)).toThrow(`File ${policyPath} does not exist`);
    });

    it('should be valid json', () => {
        const policyPath = filePath('invalidJson.json');
        expect(() => PolicyVerifier.verify(policyPath)).toThrow(`File ${policyPath} is not a valid JSON`);
    });
});

describe('PolicyName', () => {
    it('should exist', () => {
        const policyPath = filePath('noPolicyName.json');
        expect(() => PolicyVerifier.verify(policyPath)).toThrow('Policy must contain PolicyName');
    });

    it('should be string', () => {
        const policyPath = filePath('policyNameNotString.json');
        expect(() => PolicyVerifier.verify(policyPath)).toThrow('PolicyName must be a string');
    });

    it('should have correct length', () => {
        let policyPath = filePath('tooShortPolicyName.json');
        expect(() => PolicyVerifier.verify(policyPath)).toThrow(`PolicyName length must be in range 1-128`);

        policyPath = filePath('tooLongPolicyName.json');
        expect(() => PolicyVerifier.verify(policyPath)).toThrow(`PolicyName length must be in range 1-128`);
    });

    it('should match pattern', () => {
        const policyPath = filePath('invalidPolicyName.json');
        expect(() => PolicyVerifier.verify(policyPath)).toThrow(`PolicyName must match pattern ${/^[\w+=,.@-]+$/}`);
    });
});

describe('PolicyDocument', () => {
    it('should exist', () => {
        const policyPath = filePath('noPolicyDocument.json');
        expect(() => PolicyVerifier.verify(policyPath)).toThrow('Policy must contain PolicyDocument');
    });

    it('should be an object', () => {
        const policyPath = filePath('invalidPolicyDocumentType.json');
        expect(() => PolicyVerifier.verify(policyPath)).toThrow('PolicyDocument must be an object');
    });

    describe('Version', () => {
        it('should exist', () => {
            const policyPath = filePath('noVersion.json');
            expect(() => PolicyVerifier.verify(policyPath)).toThrow('PolicyDocument must contain Version');
        });

        it('should be a string', () => {
            const policyPath = filePath('versionNotString.json');
            expect(() => PolicyVerifier.verify(policyPath)).toThrow('Version must be a string');
        });

        it('should match pattern', () => {
            const policyPath = filePath('invalidVersion.json');
            expect(() => PolicyVerifier.verify(policyPath)).toThrow(`Version must match pattern ${/^\d\d\d\d-\d\d-\d\d$/}`);
        });
    })

    describe('Statement', () => {
        it('should exist', () => {
            const policyPath = filePath('noStatement.json');
            expect(() => PolicyVerifier.verify(policyPath)).toThrow('PolicyDocument must contain Statement');
        });

        it('should be an array', () => {
            const policyPath = filePath('invalidStatementType.json');
            expect(() => PolicyVerifier.verify(policyPath)).toThrow('Statement must be an array');
        });

        it('should be at least one', () => {
            const policyPath = filePath('emptyStatement.json');
            expect(() => PolicyVerifier.verify(policyPath)).toThrow('There must be at least one statement');
        });

        it('its Sid should match pattern if exists', () => {
            const policyPath = filePath('invalidSid.json');
            expect(() => PolicyVerifier.verify(policyPath)).toThrow(`Sid must match pattern ${/^[a-zA-Z0-9]+$/}`);
        });

        it('should contain Effect', () => {
            const policyPath = filePath('noEffect.json');
            expect(() => PolicyVerifier.verify(policyPath)).toThrow('Every statement must contain Effect');
        });

        it('its Effect should be "Allow" or "Deny"', () => {
            const policyPath = filePath('invalidEffect.json');
            expect(() => PolicyVerifier.verify(policyPath)).toThrow('Every effect must be "Allow" or "Deny"');
        });

        it('should contain Action or NotAction', () => {
            const policyPath = filePath('noAction.json');
            expect(() => PolicyVerifier.verify(policyPath)).toThrow('Every statement must contain Action or NotAction');
        });

        it('its NotPrincipal should be used with Effect: Deny', () => {
            const policyPath = filePath('invalidNotPrincipal.json');
            expect(() => PolicyVerifier.verify(policyPath)).toThrow('NotPrincipal must be used with Effect: Deny');
        });

        it('should contain Resource or NotResource', () => {
            const policyPath = filePath('invalidResource.json');
            expect(() => PolicyVerifier.verify(policyPath)).toThrow('Every statement must contain Resource or NotResource');
        });

    })
});