let mediaRecorder;
const recordedChunks = [];

const startRecordingButton = document.getElementById('startRecordingButton');
const stopRecordingButton = document.getElementById('stopRecordingButton');
const recognitionText = document.getElementById('recognitionText');

startRecordingButton.addEventListener('click', () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      startRecordingButton.disabled = true;
      stopRecordingButton.disabled = false;

      mediaRecorder.ondataavailable = e => {
        recordedChunks.push(e.data);
      };
    });
});

stopRecordingButton.addEventListener('click', () => {
  mediaRecorder.stop();
  startRecordingButton.disabled = false;
  stopRecordingButton.disabled = true;

  const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
  const audioFile = new File([audioBlob], 'recording.wav', { lastModified: Date.now() });

  const formData = new FormData();
  formData.append('audio', audioFile);

  fetch('YOUR_WORKER_URL', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    recognitionText.textContent = data.text;
    recordedChunks.length = 0;
  })
  .catch(error => console.error(error));
});
