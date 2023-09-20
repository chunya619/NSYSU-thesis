import os
import shutil
import mysql.connector

# Connect to the MySQL database
database = mysql.connector.connect(
  host='localhost',
  user='root',
  password='bpmf1234',
  database='Restaurant',
  auth_plugin='mysql_native_password'
)
cursor = database.cursor()

# Retrieve the photo_ids from the photo table
cursor.execute("SELECT photo_id FROM photo")
photo_ids = [photo_id[0] for photo_id in cursor.fetchall()]

# Get a list of all the .jpg files in the directory
jpg_files = [f for f in os.listdir('/Users/hujingchun/Desktop/NSYSU/NSYSUpaper&dataset/yelpDataset/yelp_photos/photos') if f.endswith('.jpg')]

# Create a new directory to store the filtered .jpg files
os.makedirs('/Users/hujingchun/Desktop/nsysuProject/static/photos', exist_ok=True)

# Iterate over the .jpg files and copy the ones that match the photo_ids
for filename in jpg_files:
    if filename.split('.')[0] in photo_ids:
        shutil.copy('/Users/hujingchun/Desktop/NSYSU/NSYSUpaper&dataset/yelpDataset/yelp_photos/photos/' + 
        filename, '/Users/hujingchun/Desktop/nsysuProject/static/photos/' + filename)
