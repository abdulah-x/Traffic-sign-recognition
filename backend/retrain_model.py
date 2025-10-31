"""
Model Retraining Script for TensorFlow 2.15+ Compatibility
Loads the original training data and retrains the model to solve compatibility issues.
"""

import os
import numpy as np
import pandas as pd
from PIL import Image
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPool2D, Dense, Flatten, Dropout
from tensorflow.keras.optimizers import Adam
from pathlib import Path

def load_training_data(dataset_path="dataset/Train"):
    """Load training data from dataset directory."""
    classes = 43
    data = []
    labels = []
    
    print("🔄 Loading training data...")
    
    for i in range(classes):
        class_path = Path(dataset_path) / str(i)
        
        if not class_path.exists():
            print(f"⚠️  Warning: Path not found: {class_path}")
            continue
        
        images = os.listdir(class_path)
        
        for img_name in images:
            try:
                img_path = class_path / img_name
                image = Image.open(img_path)
                image = image.resize((30, 30))
                image = np.array(image)
                
                data.append(image)
                labels.append(i)
                
            except Exception as e:
                print(f"❌ Error loading {img_name}: {e}")
    
    data = np.array(data)
    labels = np.array(labels)
    
    print(f"✅ Loaded {len(data)} images across {classes} classes")
    print(f"📊 Data shape: {data.shape}")
    print(f"📊 Labels shape: {labels.shape}")
    
    return data, labels

def create_model():
    """Create the CNN model architecture."""
    model = Sequential([
        # First Convolutional Block
        Conv2D(32, (5, 5), activation='relu', input_shape=(30, 30, 3)),
        Conv2D(32, (5, 5), activation='relu'),
        MaxPool2D(pool_size=(2, 2)),
        Dropout(0.25),
        
        # Second Convolutional Block
        Conv2D(64, (3, 3), activation='relu'),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPool2D(pool_size=(2, 2)),
        Dropout(0.25),
        
        # Fully Connected Layers
        Flatten(),
        Dense(256, activation='relu'),
        Dropout(0.5),
        Dense(43, activation='softmax')  # 43 classes
    ])
    
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def main():
    """Main training function."""
    print("🚦 Traffic Sign Model Retraining for TensorFlow 2.15+")
    print("=" * 60)
    
    # Load data
    data, labels = load_training_data()
    
    if len(data) == 0:
        print("❌ No data loaded. Please check dataset path.")
        return
    
    # Split data
    print("📊 Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        data, labels, test_size=0.2, random_state=42, stratify=labels
    )
    
    # One-hot encode labels
    y_train = to_categorical(y_train, 43)
    y_test = to_categorical(y_test, 43)
    
    print(f"📊 Training set: {X_train.shape}")
    print(f"📊 Test set: {X_test.shape}")
    
    # Create model
    print("🏗️  Creating model...")
    model = create_model()
    model.summary()
    
    # Train model
    print("🚀 Training model...")
    history = model.fit(
        X_train, y_train,
        batch_size=64,
        epochs=15,
        validation_data=(X_test, y_test),
        verbose=1
    )
    
    # Evaluate
    print("📈 Evaluating model...")
    test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
    print(f"✅ Test Accuracy: {test_accuracy:.4f}")
    print(f"📊 Test Loss: {test_loss:.4f}")
    
    # Save model in new format
    model_dir = Path("model")
    model_dir.mkdir(exist_ok=True)
    
    keras_path = model_dir / "traffic_sign_model_v2.keras"
    h5_path = model_dir / "traffic_sign_model_v2.h5"
    
    print("💾 Saving model...")
    model.save(keras_path)
    model.save(h5_path)
    
    print(f"✅ Model saved:")
    print(f"   📁 {keras_path}")
    print(f"   📁 {h5_path}")
    
    # Test loading
    print("🧪 Testing model loading...")
    try:
        from tensorflow.keras.models import load_model
        loaded_model = load_model(keras_path)
        print("✅ Model loads successfully!")
        
        # Quick prediction test
        test_img = X_test[0:1]  # Take first test image
        pred = loaded_model.predict(test_img)
        predicted_class = np.argmax(pred)
        confidence = np.max(pred)
        
        print(f"🔮 Test prediction: Class {predicted_class}, Confidence: {confidence:.4f}")
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
    
    print("🎉 Retraining complete!")

if __name__ == "__main__":
    main()