import os
import json

# Path to your training dataset folder
train_dir = "path/to/train"  # e.g., "dataset/train"

# Get class names from subfolder names (sorted for consistency)
class_names = sorted(os.listdir(train_dir))

# Create class indices mapping
class_indices = {class_name: idx for idx, class_name in enumerate(class_names)}

# Save mapping to JSON
with open("class_indices.json", "w") as f:
    json.dump(class_indices, f, indent=4)

print("✅ class_indices.json generated successfully!")
