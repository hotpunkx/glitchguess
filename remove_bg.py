import os
from PIL import Image

def remove_white_bg(img_path):
    try:
        img = Image.open(img_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check if pixel is white or near white
            # item is (R, G, B, A)
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0)) # Make transparent
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(img_path, "PNG")
        print(f"Successfully processed {img_path}")
    except Exception as e:
        print(f"Error processing {img_path}: {e}")

directories = ["public/categories", "public/modes"]
for dir_path in directories:
    if os.path.exists(dir_path):
        for filename in os.listdir(dir_path):
            if filename.endswith(".png"):
                remove_white_bg(os.path.join(dir_path, filename))
    else:
        print(f"Directory not found: {dir_path}")
