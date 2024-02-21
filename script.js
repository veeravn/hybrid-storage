// import entire SDK
let AWS = require('aws-sdk');

AWS.config({
    accessKeyId: awsOptions.accessKeyId, 
    secretAccessKey: awsOptions.secretAccessKey, 
    region: awsOptions.region
});

var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: awsOptions.bucketName }
});

// Listen for form submit

function uploadImage() {
  if (document.getElementById("file").value != "") {
    var uploadtext = document.getElementById("upload").innerHTML;
    document.getElementById("upload").innerHTML = "Uploading...";
    var file = document.getElementById("file").files[0];
    var fileName = file.name;
    var filePath = 'hybrid-storage-bucket-path/' + fileName;
    var fileUrl = 'https://' + awsOptions.region + '.amazonaws.com/my-first-bucket/' + filePath;
    var upload = new s3.ManagedUpload({
      params: {
        Key: filePath,
        Body: file,
      },
    }.on('httpUploadProgress', function (progress) {
      var uploaded = parseInt((progress.loaded * 100) / progress.total);
      $("progress").attr('value', uploaded);
      console.log("Upload is " + progress + "% done");
      document.getElementById("upload").innerHTML = "Uploading" + " " + progress + "%...";
    }));
    var promise = upload.promise();
    promise.then( function (err) {
      if (err) {
        reject('error');
      }
      alert('Successfully Uploaded!');
    }, function (data) {
      document.getElementById("upload").innerHTML = "Upload Successful";
      //Make file input empty
      document.getElementById("file").value = "";
    });   
  } else {
    var uploadtext = document.getElementById("upload").innerHTML;
    document.getElementById("upload").innerHTML = "Please select a file";
    // After 2 sec make it empty
    setTimeout(function () {
      document.getElementById("upload").innerHTML = uploadtext;
    }, 2000);
  }
}

// Click on download button when enter is pressed
document.getElementById("unique").addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("show").click();
  }
});
