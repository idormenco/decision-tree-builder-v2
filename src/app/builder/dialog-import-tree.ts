import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';
import { OperatorDecisionTree } from './builder.component';

@Component({
  selector: 'dialog-import-tree',
  templateUrl: 'dialog-import-tree.html',
})
export class ImportTreeDialog {
  treeJson: string = '';
  constructor(
    public dialogRef: MatDialogRef<ImportTreeDialog>) {
  }
  onNoClick() {
    this.dialogRef.close();

  }
  importTree(): void {
    const tree: OperatorDecisionTree = this.tryParseJson(this.treeJson);
    this.dialogRef.close(tree);
  }

  tryParseJson(json: string): OperatorDecisionTree {
    return JSON.parse(json);
  }
}
