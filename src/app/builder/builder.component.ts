import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { ExportTreeDialog } from './dialog-export-tree';
import { ImportTreeDialog } from './dialog-import-tree';

export interface OperatorTreeNode {
  id: string;
  text?: string;
  nodeKeys?: string[];
}

export interface OperatorTreeNodeWithOptions extends OperatorTreeNode {
  nodeKeys: string[];
}

export interface OperatorDecisionTree {
  [key: string]: OperatorTreeNode;
  initial: Required<Pick<OperatorTreeNode, 'id' | 'nodeKeys'>>;
}

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
  animations: [
    trigger('flyIn', [
      state('in', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate(250)
      ])
    ])
  ]
})
export class BuilderComponent {
  root: OperatorTreeNodeWithOptions = { id: 'initial', text: 'root', nodeKeys: [] };
  breadcrumbs: OperatorTreeNode[] = [this.root];
  current: OperatorTreeNode = this.root;

  decisionTree: OperatorDecisionTree = {
    initial: this.root
  }

  constructor(public dialog: MatDialog) { }

  isBeyondInitialQuestion(): boolean {
    return this.current.id !== 'initial';
  }

  addNode() {
    const text = prompt('Insert node text');
    if (text) {
      const nodeKey = uuidv4();
      if (this.current.nodeKeys) {
        this.current.nodeKeys = [...this.current.nodeKeys, nodeKey];
      } else {
        this.current.nodeKeys = [nodeKey]
      }
      this.decisionTree[nodeKey] = {
        id: nodeKey,
        text: text
      };
    }
  }

  selectNode(nodeKey: string) {
    const nextNode = this.decisionTree[nodeKey];
    if (nextNode) {
      this.current = nextNode;
    }
  }

  goToStart() {
    this.current = this.root;
    this.breadcrumbs = [this.root];
  }

  gotoNode(nodeKey: string) {
    const node = this.decisionTree[nodeKey]
    if (node) {
      this.current = node;
      this.breadcrumbs = _.takeWhile(this.breadcrumbs, (b) => b.id !== nodeKey);
      this.breadcrumbs.push(node);
    }
  }

  back() {
    this.breadcrumbs.pop();
    var previousNode = _.last(this.breadcrumbs)
    if (previousNode) {
      this.current = previousNode
    }
  }

  deleteNode(nodeKey: string) {
    this.current.nodeKeys = this.current.nodeKeys?.filter(key => key !== nodeKey);
    delete this.decisionTree[nodeKey];
  }

  editText(nodeKey: string) {
    const node = this.decisionTree[nodeKey];
    if (node) {
      const text = prompt('Edit node text', node.text);
      if (text) {
        this.decisionTree[nodeKey].text = text;
      }
    }
  }

  generateFiles() {
    this.dialog.open(ExportTreeDialog, {
      data: this.decisionTree,
      height: '400px',
      width: '600px'
    });
  }

  importFromFile() {
    let dialogRef = this.dialog.open(ImportTreeDialog, {
      data: this.decisionTree,
      height: '400px',
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.decisionTree = result;
        this.root = this.decisionTree.initial;
        this.current = this.root;
        this.breadcrumbs = [this.root];
      }
    });
  }

  moveNode(currentIndex: number, desiredIndex: number){
    if (!this.current.nodeKeys){
    return;
    }

    if(desiredIndex < 0 || desiredIndex >= this.current.nodeKeys.length){
      return;
    }

    [this.current.nodeKeys[currentIndex], this.current.nodeKeys[desiredIndex]] = [this.current.nodeKeys[desiredIndex], this.current.nodeKeys[currentIndex]];
  }
}