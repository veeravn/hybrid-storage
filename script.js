
let awsOptions = {
  accessKeyId: 'xxxxxxxxxxxxxx',
  secretAccessKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  region: 'us-east-1',
  bucketName: 'hybrid-storage-bucket'
};
// import entire SDK
AWS.config.update({
  accessKeyId: awsOptions.accessKeyId,
  secretAccessKey: awsOptions.secretAccessKey
});

// Listen for form submit
var s3 = new AWS.S3({
  params: { Bucket: awsOptions.bucketName, ACL: "private" },
  region: awsOptions.region,
  apiVersion: '2006-03-01'
});

var uploadtext = document.getElementById("upload").innerHTML;
uploadfile = function (file, key) {
  const params = {
    Bucket: awsOptions.bucketName,
    Key: key,
    Body: file
  };
  return s3.upload(params, function (err, data) {

    if (err) {
      console.log('There was an error uploading your file: ', err);
      return false;
    }
    console.log('Successfully uploaded file.', data);
    return true;
  });
}

function uploadImage() {
  if (document.getElementById("file").value != "") {
    var progressDiv = document.getElementById("myProgress");
    progressDiv.style.display = "block";
    var progressBar = document.getElementById("myBar");

    document.getElementById("upload").innerHTML = "Uploading...";
    
    var file = document.getElementById("file").files[0];
    var fileName = file.name;
    var filePath = awsOptions.bucketName + '-path/' + fileName;
    let fileUpload = {
      id: "",
      name: file.name,
      nameUpload: filePath,
      size: file.size,
      type: "",
      timeReference: 'Unknown',
      progressStatus: 0,
      displayName: file.name,
      status: 'Uploading..',
    }
    uploadfile(file, filePath)
      .on('httpUploadProgress', function (progress) {
        let progressPercentage = Math.round(progress.loaded / progress.total * 100);
        uploadStatus = "Upload is " + progressPercentage + "% done"
        document.getElementById("upload").innerHTML = uploadStatus

        progressBar.style.width = progressPercentage + "%";
        progressBar.innerHTML = progressPercentage + "%";
        fileUpload.progressStatus = progressPercentage;
        
        if (progressPercentage == 100) {
          fileUpload.progressStatus = progressPercentage;
          fileUpload.status = "Uploaded";
          document.getElementById("upload").innerHTML = uploadtext;
          progressDiv.style.display = "none";
        }
      });
  } else {
    document.getElementById("upload").innerHTML = "Please select a file";
    // After 2 sec make it empty
    setTimeout(function () {
      document.getElementById("upload").innerHTML = uploadtext;
    }, 2000);
  }
}
