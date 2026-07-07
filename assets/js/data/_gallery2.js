const galleryData = [
  { type:"photo", source:"local", src:"assets/img/gallery/photo1.jpg", caption:"Fieldwork / life snapshot" },
  { type:"photo", source:"local", src:"assets/img/gallery/photo2.jpg", caption:"Lab life" },
  { type:"photo", source:"local", src:"assets/img/gallery/photo3.png", caption:"Conference trip" },
  { type:"photo", source:"local", src:"assets/img/gallery/photo4.jpg", caption:"Nature walk" }

  /* Google Drive 图片示例（需先将文件共享权限设为"知道链接的任何人可查看"）：
  , { type:"photo", source:"drive",
      src:"https://drive.google.com/thumbnail?id=YOUR_FILE_ID&sz=w1000",
      caption:"From Google Drive" }
  */

  /* Google Drive 视频示例：
  , { type:"video", source:"drive",
      src:"https://drive.google.com/file/d/YOUR_VIDEO_ID/preview",
      thumb:"assets/img/gallery/video1-thumb.jpg",
      caption:"Conference talk recording" }
  */

  /* ---------- Google Drive 照片 ---------- */
  {
    type:"photo",
    source:"drive",
    src:"https://drive.google.com/thumbnail?id=1p6jXfQAw9Mn75sHmMVZ9GIDLfvi2ttMA&sz=w1000",
    caption:"Photo from Google Drive"
  },

  /* ---------- Google Drive 视频 ---------- */
  {
    type:"video",
    source:"drive",
    src:"https://drive.google.com/file/d/1cHCGFyLsAE9JoJch5Ks019G6KGGWH_or/preview",
    thumb:"https://drive.google.com/thumbnail?id=1cHCGFyLsAE9JoJch5Ks019G6KGGWH_or&sz=w500",
    caption:"Video from Google Drive"
  }
];