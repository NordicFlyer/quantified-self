import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {EventInterface} from 'quantified-self-lib/lib/events/event.interface';
import {ActivityInterface} from 'quantified-self-lib/lib/activities/activity.interface';
import {DataInterface} from 'quantified-self-lib/lib/data/data.interface';
import {AppColors} from '../../../../services/color/app.colors';
import {DynamicDataLoader} from 'quantified-self-lib/lib/data/data.store';

@Component({
  selector: 'app-event-card-stats',
  templateUrl: './event.card.stats.component.html',
  styleUrls: ['./event.card.stats.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EventCardStatsComponent implements OnChanges {
  @Input() event: EventInterface;
  @Input() selectedActivities: ActivityInterface[];
  data: MatTableDataSource<Object>;
  columns: Array<Object>;
  appColors = AppColors;

  ngOnChanges(simpleChanges) {
    this.data = new MatTableDataSource<Object>();
    this.columns = [];
    if (!this.selectedActivities.length) {
      return;
    }

    // Create the columns
    this.columns = ['Name'].concat(this.selectedActivities
      .map(activity => activity.creator.name)
      .map((key, index) => {
        return `${key} ${(new Array(index + 1)).join(' ')}`
      }));

    // Collect all the stat types from all the activities
    const stats = this.selectedActivities.reduce((statsMap, activity) => {
      Array.from(activity.getStats().values()).forEach((stat) => {
        statsMap.set(stat.getType(), stat);
      });
      return statsMap;
    }, new Map<string, DataInterface>());

    // Create the data as rows
    const data = Array.from(stats.values()).reduce((array, stat) => {
      array.push(
        this.selectedActivities.reduce((rowObj, activity, index) => {
          const activityStat = activity.getStat(stat.getType());
          if (!activityStat) {
            return rowObj;
          }
          rowObj[`${activity.creator.name} ${(new Array(index + 1)).join(' ')}`] =
            (activityStat ? activityStat.getDisplayValue() : '') +
            ' ' +
            (activityStat ? activityStat.getDisplayUnit() : '');
          return rowObj;
        }, {Name: `${stat.getDisplayType()}` }),
      );
      return array;
    }, []);

    // If we are comparing only 2 activities then add a diff column.
    // @todo support more than 2 activities for diff
    if (this.selectedActivities.length === 2) {
      this.columns = this.columns.concat(['Difference']);
      Array.from(stats.values()).forEach((stat: DataInterface, index) => {
        const firstActivityStat = this.selectedActivities[0].getStat(stat.getType());
        const secondActivityStat = this.selectedActivities[1].getStat(stat.getType());
        if (!firstActivityStat || !secondActivityStat) {
          return;
        }
        const firstActivityStatValue = firstActivityStat.getValue();
        const secondActivityStatValue = secondActivityStat.getValue();
        if (typeof firstActivityStatValue !== 'number' || typeof secondActivityStatValue !== 'number') {
          return;
        }
        // Create an obj
        data[index]['Difference'] = {};
        data[index]['Difference']['display'] = (DynamicDataLoader.getDataInstanceFromDataType(stat.getType(), Math.abs(firstActivityStatValue - secondActivityStatValue))).getDisplayValue() + ' ' + (DynamicDataLoader.getDataInstanceFromDataType(stat.getType(), Math.abs(firstActivityStatValue - secondActivityStatValue))).getDisplayUnit();
        data[index]['Difference']['percent'] = 100 * Math.abs((firstActivityStatValue - secondActivityStatValue) / ((firstActivityStatValue + secondActivityStatValue) / 2));
        // Correct the NaN with both 0's
        if (firstActivityStatValue === 0 && secondActivityStatValue === 0) {
          data[index]['Difference']['percent'] = 0
        }
      })
    }

    data.sort((left, right) => {
      if (left.Name < right.Name)
        return -1;
      if (left.Name > right.Name)
        return 1;
      return 0;
    });

    // debugger;

    // Set the data
    this.data = new MatTableDataSource(data);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.data.filter = filterValue;
  }
}
