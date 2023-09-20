from flask import Flask, jsonify, render_template, request
from flaskext.mysql import MySQL
import MySQLdb.cursors
import numpy as np
import datetime


app = Flask(__name__)

database = MySQLdb.connect(host='localhost', user='root', passwd='bpmf1234', db='Restaurant') 


@app.route('/', methods=['GET', 'POST'])

def index():

    content_type = request.headers.get('Content-Type')
    reviewsResult = []
    businessInfoResult = []
    photosResult = []
    
    if request.method == 'POST':
        if (content_type == 'application/json'):
            
            cursor = database.cursor()
            queryReviews = 'SELECT * FROM reviews WHERE name = %s'
            queryBusinessInfo = 'SELECT * FROM business WHERE name = %s'
            queryPhotos = 'SELECT * FROM photo WHERE name = %s'
            

            # receive from selected business
            dataFromOptionSelection = request.get_json()
            print('Successfully received data from option_selection POST !', dataFromOptionSelection)

            # fetch all reviews that match the business name
            for business in dataFromOptionSelection['business']:

                print('----------------------------- business:', business, '-----------------------------')
                
                ############################################ REVIEWS ############################################ 

                cursor.execute(queryReviews, [business])

                reviewsData = cursor.fetchall()

                reviewsNumpyArray = np.asarray(reviewsData)
               

                for array in reviewsNumpyArray:
                   
                    date = array[6].strftime('%Y-%m-%d')
                    
                    reviews = {'index': array[0], 'business_id': array[1], 'name': array[2], 'stars': array[4], 'text': array[5], 
                    'date': date, 'sentiment_polarity': array[8], 'sentiment_subjectivity': array[9]}

                    reviewsResult.append(reviews)
                    
                    # print('dictionary of the selected businesses:', reviewsResult)
                ############################################ BUSINESS INFO ############################################ 

                cursor.execute(queryBusinessInfo, [business])

                businessInfoData = cursor.fetchall()

                businessInfoNumpyArray = np.asarray(businessInfoData)

                for array in businessInfoNumpyArray:

                    businessInfo = {'index': array[0], 'business_id': array[1], 'name': array[2], 'address': array[3] + ', ' + array[4] + ', ' 
                    + array[5] + ', ' + array[6], 'latitude': array[7], 'longitude': array[8], 'categories': array[11], 'hours':array[12]}

                    businessInfoResult.append(businessInfo)

                # print('dictionary of the selected businesses:', businessInfoResult)


                ############################################ PHOTO ############################################ 

                cursor.execute(queryPhotos, [business])

                photosData = cursor.fetchall()

                photosNumpyArray = np.asarray(photosData)

                for array in photosNumpyArray:

                    photos = {'index': array[0], 'photo_id': array[1], 'business_id': array[2], 'name': array[3], 'caption': array[4], 'label': array[5]}

                    photosResult.append(photos)

                # print('dictionary of the selected photo:', photosResult)


        result = {

            'business_info_response': businessInfoResult,
            'reviews_response': reviewsResult,
            'photos_response': photosResult
        }

        return jsonify(result)

        
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)


