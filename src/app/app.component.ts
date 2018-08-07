import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AppService]
})

export class AppComponent implements OnInit {
  public title = '';
  public usersList: Array<any>;
  public albumsList: Array<any>;
  public photosList: Array<any>;
  public currentSelectedUserAlbum: Array<any>;

  constructor(private service: AppService) {
    this.title = 'PHOTOS';
    this.usersList = [];
    this.albumsList = [];
    this.photosList = [];
  }

  public ngOnInit() {
    this.subscribeData();
  }

  public selectUser(user: Object) {
    this.currentSelectedUserAlbum = undefined;
    this.currentSelectedUserAlbum = user['album'];
    console.log(this.currentSelectedUserAlbum);
  }

  /**
   * subscribing data from different endpoint
   */
  protected subscribeData() {
    const sub1 = this.service.getData('users');
    const sub2 = this.service.getData('albums');
    const sub3 = this.service.getData('photos');

    forkJoin(sub1, sub2, sub3).subscribe(
      val => {
        this.usersList = val[0];
        this.albumsList = val[1];
        this.photosList = val[2];

        this.asignPhotoInotAlbums();
      }
    );
  }

  /**
   * asign photos into corresponse albums and includes owner name
   * @param data [array]
   */
  protected asignPhotoInotAlbums() {
    if (this.usersList && this.albumsList && this.photosList) {

      // asign albums to each user
      this.albumsList.forEach(album => {

        if (!this.usersList[album.userId - 1].hasOwnProperty('album')) {
          this.usersList[album.userId - 1]['album'] = [];
        }

        this.usersList[album.userId - 1]['album'].push(
          {
            'id': album.id,
            'title': album.title,
            'photos': this.getAlbumPhoto(album.id)

          }
        );
      });
    }
  }

  protected getAlbum(id) {
    return this.albumsList.filter((album) => {
      return album.userId === id;
    });
  }

  protected getAlbumPhoto(albumId) {
    return this.photosList.filter((photo) => {
      return photo.albumId === albumId;
    });
  }
}
