import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UploadInfoComponent} from './upload-info.component';
import {
  MatCard,
  MatIcon,
  MatList, MatListItem, MatProgressBar,
  MatRipple
} from '@angular/material';

import {ActivityMetadataComponent} from '../activity-metadata/activity-metadata.component';
import {UPLOAD_STATUS} from "../upload/upload.status";

describe('UploadInfoComponent', () => {
  let component: UploadInfoComponent;
  let fixture: ComponentFixture<UploadInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadInfoComponent, MatProgressBar, MatList, MatListItem, MatRipple, MatIcon, MatCard, ActivityMetadataComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // @todo move this to where it belongs
  // it('should get the correct status icon', () => {
  //   expect(component.activityMetaDataStatusIcon({
  //     name: 'test',
  //     status: UPLOAD_STATUS.PROCESSING
  //   })).toBe('autorenew');
  //   expect(component.activityMetaDataStatusIcon({
  //     name: 'test',
  //     status: UPLOAD_STATUS.PROCESSED
  //   })).toBe('done');
  //   expect(component.activityMetaDataStatusIcon({
  //     name: 'test',
  //     status: UPLOAD_STATUS.ERROR
  //   })).toBe('sync_problem');
  // });

  it('should get the correct amount of processed activities', () => {
    component.activitiesMetaData = [
      {
        name: 'test',
        status: UPLOAD_STATUS.PROCESSING
      },
      {
        name: 'test',
        status: UPLOAD_STATUS.PROCESSING
      },
      {
        name: 'test',
        status: UPLOAD_STATUS.PROCESSED
      },
      {
        name: 'test',
        status: UPLOAD_STATUS.PROCESSED
      },
      {
        name: 'test',
        status: UPLOAD_STATUS.ERROR
      },
      {
        name: 'test',
        status: UPLOAD_STATUS.ERROR
      }
    ];
    expect(component.getProcessedActivities().length).toBe(4);
  });

  it('should get the correct percent of overall progress', () => {
    component.activitiesMetaData = [
      {
        name: 'test',
        status: UPLOAD_STATUS.PROCESSING
      },
      {
        name: 'test',
        status: UPLOAD_STATUS.PROCESSING
      },
      {
        name: 'test',
        status: UPLOAD_STATUS.PROCESSED
      },
      {
        name: 'test',
        status: UPLOAD_STATUS.PROCESSED
      },
      {
        name: 'test',
        status: UPLOAD_STATUS.ERROR
      },
      {
        name: 'test',
        status: UPLOAD_STATUS.ERROR
      }
    ];
    expect(component.getOverallProgress()).toBe(66.66666666666667);
  });

});
