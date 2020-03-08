import { Component, OnInit } from '@angular/core';
import { Post } from './post';
import { PostService } from './post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-post.component.html',
  styleUrls: []
})
export class AddPostComponent implements OnInit {

  addPostForm: FormGroup;

  post: Post;

  constructor(private fb: FormBuilder, private postService: PostService, private snackBar: MatSnackBar, private router: Router) {

  }

  // tslint:disable-next-line: variable-name
  add_post_validation_messages = {
    message: [
      { type: 'required', message: 'Message is required' },
      { type: 'minlength', message: 'Message is too short' },
      { type: 'maxlength', message: 'Message is too long' }
    ],
    owner: [
      { type: 'required', message: 'Owner is required' },
    ]
  };

  createForms() {
    this.addPostForm = this.fb.group({
      message: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(550)
      ])),
      owner: new FormControl('', Validators.compose([
        Validators.required,
      ]))
    });
  }

  ngOnInit() {
    this.createForms();
  }

  submitForm() {
    const formResults = this.addPostForm.value;
    const newPost: Post = {
      _id: undefined,
      owner: formResults.owner,
      message: formResults.message,
    };

    this.postService.addPost(newPost).subscribe( (newID) => {
      this.snackBar.open('Posted', null, {
        duration: 2000,
      });
    }, err => {
      this.snackBar.open('Failed to post', null, {
        duration: 2000,
      });
    });
  }
}
