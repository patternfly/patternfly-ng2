import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class CopyService {
  public dom: Document;
  private verbose: boolean = false;

  constructor(@Inject(DOCUMENT) dom: Document) {
    this.dom = dom;
  }

  /**
   * Copy a value to the user's system clipboard
   */
  copy(value: string): boolean {
    let result = false;
    let textarea = this.dom.createElement('textarea');

    textarea.style.width = '0px';
    textarea.style.height = '0px';
    textarea.style.position = 'fixed';
    textarea.style.top = '-100px';
    textarea.style.left = '-100px';
    textarea.style.opacity = '0';
    textarea.value = value;

    this.dom.body.appendChild(textarea);
    textarea.select();

    try {
      result = this.dom.execCommand('copy');
    } catch (error) {
      this.handleError(error);
    } finally {
      if (textarea.parentNode !== undefined) {
        textarea.parentNode.removeChild(textarea);
      }
    }
    return result;
  }

  /**
   * Set the verbose mode to on or off (default). During the verbose mode, each unsuccessful copy operation
   * will be printed to the console.
   *
   * @param verbose Set to true for verbose mode
   */
  setVerbose(verbose: boolean): void {
    this.verbose = verbose;
  }

  /**
   * Handles an unsuccessful copy operation.
   *
   * @param error The error message to display in the console.
   */
  private handleError(error: any): void {
    if (this.verbose) {
      console.error(error);
    }
  }
}