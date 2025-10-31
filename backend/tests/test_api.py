import pytest
import asyncio
from fastapi.testclient import TestClient
from io import BytesIO
from PIL import Image
import sys
from pathlib import Path

# Add backend to path
sys.path.append(str(Path(__file__).parent.parent))

from app import app

client = TestClient(app)

def create_test_image():
    """Create a test image for upload testing."""
    img = Image.new('RGB', (100, 100), color='red')
    img_buffer = BytesIO()
    img.save(img_buffer, format='PNG')
    img_buffer.seek(0)
    return img_buffer

class TestAPI:
    
    def test_root_endpoint(self):
        """Test the root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data

    def test_health_endpoint(self):
        """Test the health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "model_loaded" in data
        assert "timestamp" in data
        assert "supported_formats" in data
        assert "max_file_size_mb" in data

    def test_predict_no_file(self):
        """Test prediction endpoint without file."""
        response = client.post("/predict")
        assert response.status_code == 422  # Unprocessable Entity

    def test_predict_invalid_file_type(self):
        """Test prediction with invalid file type."""
        # Create a text file
        text_content = "This is not an image"
        files = {"file": ("test.txt", BytesIO(text_content.encode()), "text/plain")}
        
        response = client.post("/predict", files=files)
        assert response.status_code == 400
        data = response.json()
        assert "error" in data

    def test_predict_valid_image(self):
        """Test prediction with valid image."""
        # Create test image
        test_image = create_test_image()
        files = {"file": ("test.png", test_image, "image/png")}
        
        response = client.post("/predict", files=files)
        
        # Should return 200 if model loaded, 503 if not
        assert response.status_code in [200, 503]
        data = response.json()
        
        if response.status_code == 200:
            assert "class_id" in data
            assert "label" in data
            assert "confidence" in data
        else:
            assert "error" in data

    def test_predict_large_file(self):
        """Test prediction with file that's too large."""
        # Create a large image (simulate by creating buffer larger than limit)
        large_buffer = BytesIO(b'0' * (11 * 1024 * 1024))  # 11MB
        files = {"file": ("large.png", large_buffer, "image/png")}
        
        response = client.post("/predict", files=files)
        assert response.status_code == 400
        data = response.json()
        assert "File too large" in data["error"]