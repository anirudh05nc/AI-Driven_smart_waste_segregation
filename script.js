document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const video = document.getElementById('camera');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');
    const startCameraBtn = document.getElementById('startCameraBtn');
    const stopCameraBtn = document.getElementById('stopCameraBtn');
    const imageUpload = document.getElementById('imageUpload');
    const uploadBtn = document.getElementById('uploadBtn');
    const resultDiv = document.getElementById('result');
    const confidenceMeter = document.getElementById('confidence');
    const dropZone = document.getElementById('dropZone');
    
    let stream = null;
    
    // Start Camera
    startCameraBtn.addEventListener('click', async function() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' },
                audio: false 
            });
            video.srcObject = stream;
            startCameraBtn.disabled = true;
            stopCameraBtn.disabled = false;
            captureBtn.disabled = false;
        } catch (err) {
            console.error("Error accessing camera: ", err);
            resultDiv.textContent = "Error accessing camera. Please ensure you've granted camera permissions.";
        }
    });
    
    // Stop Camera
    stopCameraBtn.addEventListener('click', function() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
            startCameraBtn.disabled = false;
            stopCameraBtn.disabled = true;
            captureBtn.disabled = true;
        }
    });
    
    // Capture Image
    captureBtn.addEventListener('click', function() {
        if (!stream) return;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.style.display = 'block';
        
        // Process the captured image
        processImage(canvas.toDataURL('image/jpeg'));
    });
    
    // File Upload
    uploadBtn.addEventListener('click', function() {
        imageUpload.click();
    });
    
    imageUpload.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    processImage(event.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                resultDiv.textContent = "Please select an image file.";
            }
        }
    });
    
    // Drag and Drop
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.style.borderColor = '#2980b9';
        dropZone.style.backgroundColor = '#f8fafc';
    });
    
    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dropZone.style.borderColor = '#3498db';
        dropZone.style.backgroundColor = 'transparent';
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.style.borderColor = '#3498db';
        dropZone.style.backgroundColor = 'transparent';
        
        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    processImage(event.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                resultDiv.textContent = "Please drop an image file.";
            }
        }
    });
    
    // Process Image (Mock Classification)
    function processImage(imageData) {
        // Show loading state
        resultDiv.textContent = "Classifying...";
        confidenceMeter.style.setProperty('--width', '0%');
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Mock classification results
            const wasteTypes = [
                "Organic Waste",
                "Recyclable Plastic",
                "Paper Waste",
                "Metal",
                "Glass",
                "E-Waste",
                "Hazardous Waste"
            ];
            
            const randomType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
            const randomConfidence = (Math.random() * 80 + 20).toFixed(2);
            
            // Display results
            resultDiv.textContent = `Classification: ${randomType}`;
            confidenceMeter.style.setProperty('--width', `${randomConfidence}%`);
            confidenceMeter.setAttribute('data-confidence', `${randomConfidence}% confidence`);
            
            // In a real app, you would call your ML model API here
            // fetch('/classify', {
            //     method: 'POST',
            //     body: JSON.stringify({ image: imageData }),
            //     headers: { 'Content-Type': 'application/json' }
            // })
            // .then(response => response.json())
            // .then(data => {
            //     resultDiv.textContent = `Classification: ${data.class}`;
            //     confidenceMeter.style.setProperty('--width', `${data.confidence}%`);
            //     confidenceMeter.setAttribute('data-confidence', `${data.confidence}% confidence`);
            // });
            
        }, 1500);
    }
    
    // Initialize with camera stopped
    stopCameraBtn.disabled = true;
    captureBtn.disabled = true;
});