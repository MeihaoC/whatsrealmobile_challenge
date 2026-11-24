import { TestBed } from '@angular/core/testing';
import { UserService } from './user-service';
import { Plan, User } from '../models/user';

// builds a test user, so each test only spells out what it cares about
function makeUser(id: string, name: string, plan: Partial<Plan> = {}): User {
  return {
    id,
    name,
    email: 'test@test.com',
    age: 30,
    plan: {
      type: 'basic',
      status: 'active',
      description: 'The Basics Package',
      features: { conferenceCalling: false, callWaiting: false, voicemail: true },
      ...plan,
    },
  };
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = TestBed.inject(UserService);
  });

  describe('cleanUsers', () => {
    it('keeps every user, including duplicates', () => {
      const result = service.cleanUsers([
        makeUser('a', 'Jane Smith'),
        makeUser('b', 'Tom Brady'),
        makeUser('a', 'Krystal Johnson'),
      ]);

      expect(result).toHaveLength(3);
    });

    it('keeps the first id and renames later duplicates', () => {
      const result = service.cleanUsers([
        makeUser('a', 'Jane Smith'),
        makeUser('a', 'Krystal Johnson'),
      ]);

      expect(result[0].id).toBe('a');
      expect(result[1].id).toBe('a-2');
    });

    it('makes every id unique', () => {
      const result = service.cleanUsers([
        makeUser('a', 'Jane Smith'),
        makeUser('b', 'Tom Brady'),
        makeUser('a', 'Krystal Johnson'),
      ]);

      const ids = result.map(user => user.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('warns on both users that share an id', () => {
      const result = service.cleanUsers([
        makeUser('a', 'Jane Smith'),
        makeUser('a', 'Krystal Johnson'),
      ]);

      expect(result[0].dataWarnings).toHaveLength(1);
      expect(result[1].dataWarnings).toHaveLength(1);
    });

    it('warns when the plan type does not match the description', () => {
      const [casey] = service.cleanUsers([
        makeUser('c', 'Casey Daniels', { type: 'basic', description: 'The Lite Package' }),
      ]);

      expect(casey.dataWarnings?.[0]).toContain("doesn't match");
    });

    it('gives clean users no warnings', () => {
      const [tom] = service.cleanUsers([makeUser('b', 'Tom Brady')]);

      expect(tom.dataWarnings).toEqual([]);
    });

    it('does not change the original data', () => {
      const input = [makeUser('a', 'Jane Smith'), makeUser('a', 'Krystal Johnson')];

      service.cleanUsers(input);

      expect(input[1].id).toBe('a');
      expect(input[1].dataWarnings).toBeUndefined();
    });
  });
});
