import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name?: string;
  email?: string;
  password?: string;

  constructor(private authService: AuthService) { }

  async ngOnInit() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');

    const video = document.getElementById('video') as HTMLVideoElement;
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => video.srcObject = stream)
      .catch(error => console.error('Error accessing the camera: ', error));
  }

  async registerUser() {
    const video = document.getElementById('video') as HTMLVideoElement;
    const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

    if (!detections) {
      console.error('No face detected');
      return;
    }

    const descriptor = detections.descriptor;

    const user = {
      name: this.name,
      email: this.email,
      password: this.password,
      descriptor: Array.from(descriptor)
    };

    this.authService.register(user).subscribe(response => {
      console.log(response);
    }, error => {
      console.error('Error registering user: ', error);
    });
  }
}
