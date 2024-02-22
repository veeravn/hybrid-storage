import { XhrHttpHandler } from "@aws-sdk/xhr-http-handler";
let awsOptions = {
  accessKeyId: 'AKIATQQEVDB2DOHAALFZ',
  secretAccessKey: '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',
  region: 'us-east-1',
  bucketName: 'hybrid-storage-bucket'
};
AWS.XhrHttpHandler
// import entire SDK
AWS.config.update({
    accessKeyId: awsOptions.accessKeyId, 
    secretAccessKey: awsOptions.secretAccessKey
});

var s3 = new AWS.S3.ManagedUpload({ 
  region: awsOptions.region,
  requestHandler: new XhrHttpHandler({}),
  apiVersion: '2006-03-01'
});

// Listen for form submit

function uploadImage() {
  if (document.getElementById("file").value != "") {
    var uploadtext = document.getElementById("upload").innerHTML;
    document.getElementById("upload").innerHTML = "Uploading...";
    var file = document.getElementById("file").files[0];
    var fileName = file.name;
    var filePath = awsOptions.bucketName + '-path/' + fileName;
    var fileUrl = 'https://' + awsOptions.region + '.amazonaws.com/' + awsOptions.bucketName + '/' + filePath;
    var upload = s3.upload({Bucket: awsOptions.bucketName, Key: filePath, Body: file, ACL: "private"});
    promise = upload.promise();

    promise.then('httpUploadProgress', function (progress) {
      var uploaded = parseInt((progress.loaded * 100) / progress.total);
      $("progress").attr('value', uploaded);
      console.log("Upload is " + progress + "% done");
      document.getElementById("upload").innerHTML = "Uploading" + " " + progress + "%...";
    }, function (data) {
      alert("Successfully uploaded photo.");
      document.getElementById("upload").innerHTML = "Upload"
    },
    function (err) {
      return alert("There was an error uploading your photo: ", err.message);
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
