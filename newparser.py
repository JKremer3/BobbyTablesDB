import json
import psycopg2
from flatten_json import flatten


def cleanStr4SQL(s):
    return s.replace("'", "`").replace("\n", " ")


def int2BoolStr(value):
    if value == 0:
        return 'False'
    else:
        return 'True'


def insert2BusinessTable():
    #reading the JSON file
    with open('./business.JSON', 'r') as f:  # TODO: update path for the input file
        #outfile =  open('./yelp_business.SQL', 'w')  #uncomment this line if you are writing the INSERT statements to an output file.
        line = f.readline()
        count_line = 0

        #connect to yelpdb database on postgres server using psycopg2
        #TODO: update the database name, username, and password
        try:
            conn = psycopg2.connect(
                "dbname='business' user='postgres' host='localhost' password='bobby'")
        except:
            print('Unable to connect to the database!')
        cur = conn.cursor()

        while line:
            data = json.loads(line)
            # Generate the INSERT statement for the cussent business
            # TODO: The below INSERT statement is based on a simple (and incomplete) businesstable schema. Update the statement based on your own table schema and
            # business
            business = "INSERT INTO business (busId, busName, address, busState, city, postalCode, lat, long, stars, numCheckins, numTips, isOpen, revCount) " \
                "VALUES ('" + data['business_id'] + "','" + cleanStr4SQL(data["name"]) + "','" + cleanStr4SQL(data["address"]) + "','" + \
                cleanStr4SQL(data["state"]) + "','" + cleanStr4SQL(data["city"]) + "','" + data["postal_code"] + "'," + str(data["latitude"]) + "," + \
                str(data["longitude"]) + "," + str(data["stars"]
                                                   ) + ", 0 , 0 ," + str(data["is_open"]) + ", 0 );"
            try:
                cur.execute(business)
            except:
                print("Insert to business failed!")
            conn.commit()

            #busCategories
            categories = data["categories"].split(', ')
            for x in categories:
                busCategory = " INSERT INTO buscategory (busId, category) VALUES ('" + \
                    data['business_id'] + "', '" + str(x) + "'""); "
                #print(busCategory)
                try:
                    cur.execute(busCategory)
                except:
                    print("Insert to busCategory failed!")
                # need to apply changes or lose them
                conn.commit()

            # Attributes
            flatatrib = flatten(data["attributes"])
            for key, value in flatatrib.items():
                if (key and value):
                    if(key.startswith("GoodForMeal")):  # busGoodForMeals
                        if (key == 'GoodForMeal'):
                            newkey = (key , key)
                        else:
                            newkey = key.split('_')
                        if (value == 'None'):
                            newvalue = 'False'
                        else:
                            newvalue = value
                        busGoodForMeals = " INSERT INTO busgoodformeals (busId, mealtype, mealval) VALUES ('" + data['business_id'] + "', '" + str(newkey[1]) + "', " \
                            + str(value) + "); "
                        #print(busGoodForMeals)
                        try:
                            cur.execute(busGoodForMeals)
                        except:
                            print("Insert to busGoodForMeals failed!")
                    elif (key.startswith("Ambience")):  # busAmbience
                        if (key == 'Ambience'):
                            newkey = (key , key)
                        else:
                            newkey = key.split('_')
                        if (value == 'None'):
                            newvalue = 'False'
                        else:
                            newvalue = value
                        busAmbience = " INSERT INTO busambience (busId, ambiencetype, ambienceval) VALUES ('" + data['business_id'] + "', '" + str(newkey[1]) + "', " \
                            + str(value) + "); "
                        #print(busAmbience)
                        try:
                            cur.execute(busAmbience)
                        except:
                            print("Insert to busAmbience failed!")
                    elif (key.startswith("BusinessParking")):  # busParking
                        if (key == 'BusinessParking'):
                            newkey = (key, key)
                        else:
                            newkey = key.split('_')
                        if (value == 'None'):
                            newvalue = 'False'
                        else:
                            newvalue = value
                        #print(newvalue)
                        busParking = " INSERT INTO busParking (busId, parkingType, parkVal) VALUES ('" + data['business_id'] + "', '" + str(newkey[1]) + "', " \
                            + str(newvalue) + "); "
                        #print(busParking)
                        try:
                            cur.execute(busParking)
                        except:
                            print("Insert to busParking failed!")
                    else:                                   # all other attributes
                        attributes = " INSERT INTO busattributes (busId, attributename, attributeval) VALUES ('" + data['business_id'] + "', '" + str(key) + "', '" \
                            + str(value) + "'""); "
                        #print(attributes)
                        try:
                            cur.execute(attributes)
                        except:
                            print("Insert to busAttributes failed!")
                    conn.commit()

            #try:
            #    cur.execute(busCategory)
            #except:
            #    print("Insert to busCategory failed!")
            #conn.commit()
            # optionally you might write the INSERT statement to a file.
            # outfile.write(business)

            line = f.readline()
            count_line += 1

        cur.close()
        conn.close()

    print(count_line)
    #outfile.close()  #uncomment this line if you are writing the INSERT statements to an output file.
    f.close()


def parseBusinessData():
    #read the JSON file
    # Assumes that the data files are available in the current directory. If not, you should set the path for the yelp data files.
    with open('yelp_business.JSON', 'r') as f:
        outfile = open('business.txt', 'w')
        line = f.readline()
        count_line = 0
        #read each JSON abject and extract data
        while line:
            data = json.loads(line)
            # instead of write out create sql insert
            outfile.write(cleanStr4SQL('business info: ' +
                                       data['business_id'])+' ; ')  # business id
            outfile.write(cleanStr4SQL(data['name'])+' ; ')  # name
            outfile.write(cleanStr4SQL(data['address'])+' ; ')  # full_address
            outfile.write(cleanStr4SQL(data['state'])+' ; ')  # state
            outfile.write(cleanStr4SQL(data['city'])+' ; ')  # city
            outfile.write(cleanStr4SQL(data['postal_code']) + ' ; ')  # zipcode
            outfile.write(str(data['latitude'])+' ; ')  # latitude
            outfile.write(str(data['longitude'])+' ; ')  # longitude
            outfile.write(str(data['stars'])+' ; ')  # stars
            outfile.write(str(data['review_count'])+' ; ')  # reviewcount
            outfile.write(str(data['is_open'])+'\n')  # openstatus

            categories = data["categories"].split(', ')
            outfile.write(str(categories)+'\n')  # category list

            # write your own code to process attributes
            flatatrib = flatten(data["attributes"])
            outfile.write(str(flatatrib)+'\n')

            # write your own code to process hours
            hours = []
            for key, value in data["hours"].items():
                if (key and value):
                    newtime = value.split('-')
                    hours = hours + [(key, [newtime[0], newtime[1]])]
            outfile.write(cleanStr4SQL('hours: ' + str(hours)))
            outfile.write('\n')

            line = f.readline()
            count_line += 1
            #print('new line')
    print(count_line)
    outfile.close()
    f.close()


def parseUserData():
    #read the JSON file
    # Assumes that the data files are available in the current directory. If not, you should set the path for the yelp data files.
    with open('yelp_user.JSON', 'r') as f:
        outfile = open('user.txt', 'w')
        line = f.readline()
        count_line = 0
        #read each JSON abject and extract data
        while line:
            data = json.loads(line)
            outfile.write(str(data['average_stars'])+'\t')  # average_stars
            outfile.write(str(data['cool'])+'\t')  # cool
            outfile.write(str(data['fans'])+'\t')  # fans
            outfile.write(str(data["friends"])+'\t')  # friends list
            outfile.write(str(data['funny'])+'\t')  # funny
            outfile.write(str(data['name'])+'\t')  # name
            outfile.write(str(data['tipcount'])+'\t')  # tipcount
            outfile.write(str(data['useful'])+'\t')  # useful
            outfile.write(str(data['user_id'])+'\t')  # user_id
            # yelping_since
            outfile.write(cleanStr4SQL(data['yelping_since'])+'\t')

            outfile.write('\n')

            line = f.readline()
            count_line += 1
    print(count_line)
    outfile.close()
    f.close()


def parseCheckinData():
    #read the JSON file
    # Assumes that the data files are available in the current directory. If not, you should set the path for the yelp data files.
    with open('yelp_checkin.JSON', 'r') as f:
        outfile = open('checkin.txt', 'w')
        line = f.readline()
        count_line = 0
        #read each JSON abject and extract data
        while line:
            data = json.loads(line)
            outfile.write(cleanStr4SQL(
                data['business_id'])+'\t')  # business id
            dates = data["date"]

            splitDates = dates.split(",")
            extraSplitDates = []
            for x in splitDates:
                x.split(" ")
                y = x.split("-")
                extraSplitDates.append(y)

            outfile.write(str(extraSplitDates)+'\t')

            outfile.write('\n')

            line = f.readline()
            count_line += 1
    print(count_line)
    outfile.close()
    f.close()


def parseTipData():
    #read the JSON file
    # Assumes that the data files are available in the current directory. If not, you should set the path for the yelp data files.
    with open('yelp_tip.JSON', 'r') as f:
        outfile = open('tip.txt', 'w')
        line = f.readline()
        count_line = 0
        #read each JSON abject and extract data
        while line:
            data = json.loads(line)
            outfile.write(cleanStr4SQL(
                data['business_id'])+'\t')  # business id
            outfile.write(str(data['date'])+'\t')  # date
            outfile.write(str(data['likes'])+'\t')  # likes
            outfile.write(str(data["text"])+'\t')  # text
            outfile.write(str(data['user_id'])+'\t')  # user_id

            outfile.write('\n')

            line = f.readline()
            count_line += 1
    print(count_line)
    outfile.close()
    f.close()


insert2BusinessTable()
#parseBusinessData()
#parseUserData()
#parseCheckinData()
#parseTipData()
