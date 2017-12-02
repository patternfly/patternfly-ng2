import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { cloneDeep, defaults, isEqual } from 'lodash';

import { FilterConfig } from './filter-config';
import { FilterEvent } from './filter-event';
import { FilterField } from './filter-field';
import { FilterQuery } from './filter-query';

/**
 * Component for the filter query field and filter query dropdown
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'pfng-filter-fields',
  styleUrls: ['./filter-fields.component.less'],
  templateUrl: './filter-fields.component.html'
})
export class FilterFieldsComponent implements DoCheck, OnInit {
  /**
   * The filter config containing component properties
   */
  @Input() config: FilterConfig;

  /**
   * The event emitted when a filter has been added
   */
  @Output('onAdd') onAdd = new EventEmitter();

  /**
   * The event emitted when a saved filter has been deleted
   */
  @Output('onDelete') onDelete = new EventEmitter();

  /**
   * The event emitted when a field menu option is selected
   */
  @Output('onFieldSelect') onFieldSelect = new EventEmitter();

  /**
   * The event emitted when the user types ahead in the query input field
   */
  @Output('onTypeAhead') onTypeAhead = new EventEmitter();

  private _currentField: FilterField;
  private _currentValue: string;
  private defaultConfig = {} as FilterConfig;
  private prevConfig: FilterConfig;

  /**
   * The default constructor
   */
  constructor() {
  }

  // Initialization

  /**
   * Setup component configuration upon initialization
   */
  ngOnInit(): void {
    this.setupConfig();
  }

  /**
   * Check if the component config has changed
   */
  ngDoCheck(): void {
    // Do a deep compare on config
    if (!isEqual(this.config, this.prevConfig)) {
      this.setupConfig();
    }
  }

  /**
   * Set up default config
   */
  protected setupConfig(): void {
    if (this.config !== undefined) {
      defaults(this.config, this.defaultConfig);
    } else {
      this.config = cloneDeep(this.defaultConfig);
    }

    if (this.config && this.config.fields === undefined) {
      this.config.fields = [];
    }
    if (this.config && this.config.tooltipPlacement === undefined) {
      this.config.tooltipPlacement = 'top';
    }
    this.initCurrentField();
    this.prevConfig = cloneDeep(this.config);
  }

  /**
   * Initialize current field and value
   */
  protected initCurrentField(): void {
    let fieldFound: boolean = false;
    if (this._currentField !== undefined) {
      this.config.fields.forEach((nextField) => {
        if (nextField.id === this._currentField.id) {
          fieldFound = true;
          return;
        }
      });
    }
    if (!fieldFound) {
      this._currentField = this.config.fields[0];
      this._currentValue = null;
    }
    if (this._currentValue === undefined) {
      this._currentValue = null;
    }
  }

  /**
   * Reset current field and value
   */
  reset(): void {
    this._currentField = undefined;
    this.initCurrentField();
  }

  // Getters & setters

  /**
   * Get the current filter field
   *
   * @returns {FilterField} The current filter field
   */
  get currentField(): FilterField {
    return this._currentField;
  }

  /**
   * Get the current filter field value
   *
   * @returns {string} The current filter field value
   */
  get currentValue(): string {
    return this._currentValue;
  }

  /**
   * Set the current filter field value
   *
   * @param val The current filter field value
   */
  set currentValue(val: string) {
    this._currentValue = val;
  }

  // Private

  private deleteQuery($event: MouseEvent, filterQuery: FilterQuery, el: HTMLElement): void {
    // Unset focus
    if (el !== undefined) {
      el.blur();
    }

    // Close previous open confirmation
    this.hideDeleteConfirm(false);

    // Show delete query confirmation
    (filterQuery as any).showDeleteConfirm = true;

    // Menu should remain open
    $event.stopPropagation();
  }

  private deleteQueryCancel($event: MouseEvent, filterQuery: FilterQuery): void {
    // Hide delete query confirmation
    (filterQuery as any).showDeleteConfirm = false;

    // Menu should remain open
    $event.stopPropagation();
  }

  private deleteQueryConfirm($event: MouseEvent, filterQuery: FilterQuery): void {
    // Hide delete query confirmation
    (filterQuery as any).showDeleteConfirm = false;

    // Menu should remain open
    if (this._currentField.queries.length > 1) {
      $event.stopPropagation();
    }
    this.onDelete.emit({
      field: this._currentField,
      query: filterQuery,
      value: filterQuery.value
    } as FilterEvent);
    this._currentValue = null;
  }

  private fieldInputKeyPress($event: KeyboardEvent): void {
    if ($event.which === 13 && this._currentValue && this._currentValue.length > 0) {
      this.onAdd.emit({
        field: this._currentField,
        value: this._currentValue
      } as FilterEvent);
      this._currentValue = undefined;
    }
  }

  // Hide all delete confirm
  private hideDeleteConfirm(isOpen: boolean): void {
    this._currentField.queries.forEach(query => {
      (query as any).showDeleteConfirm = false;
    });
  }

  private isFieldDisabled(field: FilterField): boolean {
    if (field.type === undefined || field.type === 'text') {
      return false;
    }
    return (field.queries === undefined || field.queries.length === 0);
  }

  private queryInputChange(value: string) {
    this.onTypeAhead.emit({
      field: this._currentField,
      value: this._currentValue
    } as FilterEvent);
  }

  private selectField(field: FilterField): void {
    this._currentField = field;
    this._currentValue = null;
    this.onFieldSelect.emit({
      field: this._currentField,
      value: this._currentValue
    } as FilterEvent);
  }

  private selectQuery(filterQuery: FilterQuery): void {
    this.onAdd.emit({
      field: this._currentField,
      query: filterQuery,
      value: filterQuery.value
    } as FilterEvent);
    this._currentValue = null;
  }

  private showDelete(): boolean {
    let result = false;
    this._currentField.queries.forEach(query => {
      if (query.showDelete === true) {
        result = true;
        return;
      }
    });
    return result;
  }
}
