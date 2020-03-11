import { Component, OnInit } from '@angular/core';
import { Post } from './post';
import { PostService } from './post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: []
})
export class AddPostComponent implements OnInit {

  addPostForm: FormGroup;

  post: Post;
  id: string;

  constructor(private fb: FormBuilder, private postService: PostService, private snackBar: MatSnackBar,
              private router: Router, private route: ActivatedRoute) {
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
    // grabbing owner id from api
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
    });
  }

  submitForm() {
    const formResults = this.addPostForm.value;
    const newPost: Post = {
      owner_id: this.id,
      _id: undefined,
      owner: formResults.owner,
      message: formResults.message,
    };

    this.postService.addPost(this.id, newPost).subscribe(() => {
      this.snackBar.open('Posted', null, {
        duration: 2000,
      });
      // after submission, navigate back to the owner's doorboard
      this.router.navigate(['/owner/' + this.id + '/posts']);
    }, err => {
      this.snackBar.open('Failed to post', null, {
        duration: 2000,
      });
    });
  }
}
