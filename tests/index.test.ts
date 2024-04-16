import {isCorrectPolicy} from '../src';
import path from 'path';


function filePath(filename: string) {
    return path.join(__dirname, 'data', filename);
}

describe('Correct policy', () => {
    it('should pass', () => {
        const policyPath = filePath('asterisk.json');
        expect(isCorrectPolicy(policyPath)).toBeFalsy();
    });

    it('should not pass', () => {
        const policyPath = filePath('noAsterisk.json');
        expect(isCorrectPolicy(policyPath)).toBeTruthy();
    });
});

describe('File', () => {
    it('should exist', () => {
        const policyPath = filePath('notExistingFile.json');
        expect(() => isCorrectPolicy(policyPath)).toThrow(`File ${policyPath} does not exist`);
    });

    it('should be valid json', () => {
        const policyPath = filePath('invalidJson.json');
        expect(() => isCorrectPolicy(policyPath)).toThrow(`File ${policyPath} is not a valid JSON`);
    });
});

describe('PolicyName', () => {
    it('should exist', () => {
        const policyPath = filePath('noPolicyName.json');
        expect(() => isCorrectPolicy(policyPath)).toThrow('Policy must contain PolicyName');
    });

    it('should be string', () => {
        const policyPath = filePath('policyNameNotString.json');
        expect(() => isCorrectPolicy(policyPath)).toThrow('PolicyName must be a string');
    });

    it('should have correct length', () => {
        let policyPath = filePath('tooShortPolicyName.json');
        expect(() => isCorrectPolicy(policyPath)).toThrow(`PolicyName length must be in range 1-128`);


        policyPath = filePath('tooLongPolicyName.json');
        expect(() => isCorrectPolicy(policyPath)).toThrow(`PolicyName length must be in range 1-128`);
    });

    it('should match pattern', () => {
        const policyPath = filePath('invalidPolicyName.json');
        expect(() => isCorrectPolicy(policyPath)).toThrow(`PolicyName must match pattern ${/^[\w+=,.@-]+$/}`);
    });
});

describe('PolicyDocument', () => {
    it('should exist', () => {
        const policyPath = filePath('noPolicyDocument.json');
        expect(() => isCorrectPolicy(policyPath)).toThrow('Policy must contain PolicyDocument');
    });

    it('should be an object', () => {
        const policyPath = filePath('invalidPolicyDocumentType.json');
        expect(() => isCorrectPolicy(policyPath)).toThrow('PolicyDocument must be an object');
    });

    describe('Version', () => {
        it('should exist', () => {
            const policyPath = filePath('noVersion.json');
            expect(() => isCorrectPolicy(policyPath)).toThrow('PolicyDocument must contain Version');
        });

        it('should be a string', () => {
            const policyPath = filePath('versionNotString.json');
            expect(() => isCorrectPolicy(policyPath)).toThrow('Version must be a string');
        });

        it('should match pattern', () => {
            const policyPath = filePath('invalidVersion.json');
            expect(() => isCorrectPolicy(policyPath)).toThrow(`Version must match pattern ${/^\d\d\d\d-\d\d-\d\d$/}`);
        });
    })

    describe('Statement', () => {
        it('should exist', () => {
            const policyPath = filePath('noStatement.json');
            expect(() => isCorrectPolicy(policyPath)).toThrow('PolicyDocument must contain Statement');
        });

        it('should be an object', () => {
            const policyPath = filePath('invalidStatementType.json');
            expect(() => isCorrectPolicy(policyPath)).toThrow('Statement must be an object');
        });

        it('should contain Effect', () => {
            const policyPath = filePath('noEffect.json');
            expect(() => isCorrectPolicy(policyPath)).toThrow('Every statement must contain Effect');
        });

        it('its Effect should be "Allow" or "Deny"', () => {
            const policyPath = filePath('invalidEffect.json');
            expect(() => isCorrectPolicy(policyPath)).toThrow('Every effect must be "Allow" or "Deny"');
        });
    })
});