import { Component, computed, input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { User } from '../../models/user';

@Component({
  imports: [TitleCasePipe],
  selector: 'app-user-summary',
  styleUrl: './user-summary.css',
  templateUrl: './user-summary.html',
})
export class UserSummary {
  users = input.required<User[]>();

  total = computed(() => this.users().length);

  activeCount = computed(() =>
    this.users().filter(user => user.plan.status === 'active').length
  );

  inactiveCount = computed(() => this.total() - this.activeCount());

  issuesCount = computed(() =>
    this.users().filter(user => (user.dataWarnings?.length ?? 0) > 0).length
  );

  planCounts = computed(() => {
    const counts = new Map<string, number>();
    for (const user of this.users()) {
      const type = user.plan.type;
      counts.set(type, (counts.get(type) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => a.type.localeCompare(b.type));
  });
}
