import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';
import { OperatorDecisionTree, OperatorTreeNodeWithOptions } from './builder.component';

@Component({
  selector: 'dialog-export-tree',
  templateUrl: 'dialog-export-tree.html',
})
export class ExportTreeDialog {
  tree: OperatorDecisionTree;
  localization: { [key: string]: string | undefined; };
  emptyLocalization: { [key: string]: string | undefined; };
  treeJson: string;
  localizationJson: string;
  emptyLocalizationJson: string;

  constructor(
    public dialogRef: MatDialogRef<ExportTreeDialog>,
    @Inject(MAT_DIALOG_DATA) public inputTree: OperatorDecisionTree,
  ) {
    this.tree = this.normalize(inputTree);
    this.localization = this.getLocalizationConfig(this.tree);
    this.emptyLocalization = this.getEmptyLocalizationConfig(this.tree);
    this.treeJson = JSON.stringify(this.tree, null, 4);
    this.localizationJson = JSON.stringify(this.localization, null, 4);
    this.emptyLocalizationJson = JSON.stringify(this.emptyLocalization, null, 4);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  normalize(inputTree: OperatorDecisionTree) {
    let parentPrefix = '';
    const roodNodeKeys = this.reindexKeys(parentPrefix, inputTree.initial.nodeKeys);
    const root: OperatorTreeNodeWithOptions = {
      id: 'initial',
      text: 'root',
      nodeKeys: roodNodeKeys.map(el => el.newKey)
    };

    const newTree: OperatorDecisionTree = {
      initial: root
    }

    let queue = [...roodNodeKeys];

    while (queue.length) {
      var mapping = queue.pop();
      if (mapping) {
        const keys = this.reindexKeys(mapping.newKey, inputTree[mapping.oldKey].nodeKeys);
        newTree[mapping.newKey] = {
          id: mapping.newKey,
          text: inputTree[mapping.oldKey].text,
          nodeKeys: keys.map(el => el.newKey)
        };

        queue = [...queue, ...keys];
      }
    }
    return newTree;
  }

  reindexKeys(parentPrefix: string, nodeKeys: string[] | undefined) {
    if (nodeKeys) {
      return nodeKeys.map((key, index) => ({ oldKey: key, newKey: parentPrefix + index }));
    }
    return [];
  }

  getLocalizationConfig(tree: OperatorDecisionTree): { [key: string]: string | undefined; } {
    const result: { [key: string]: string | undefined; } = {};
    for (const [key, value] of Object.entries(tree)) {
      if (key === 'initial') {
        continue;
      }
      const localizationKey = `tree.label.${key}`;
      result[localizationKey] = value.text;
    }

    return result;
  }

  getEmptyLocalizationConfig(tree: OperatorDecisionTree): { [key: string]: string | undefined; } {
    const result: { [key: string]: string | undefined; } = {};
    for (const [key, value] of Object.entries(tree)) {
      if (key === 'initial') {
        continue;
      }
      const localizationKey = `tree.label.${key}`;
      result[localizationKey] = '';
    }

    return result;
  }
}
