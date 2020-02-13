import json
from flatten_json import flatten


def cleanStr4SQL(s):
    return s.replace("'", "`").replace("\n", " ")


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
            outfile.write(cleanStr4SQL(
                data['business_id'])+'\t')  # business id
            outfile.write(cleanStr4SQL(data['name'])+'\t')  # name
            outfile.write(cleanStr4SQL(data['address'])+'\t')  # full_address
            outfile.write(cleanStr4SQL(data['state'])+'\t')  # state
            outfile.write(cleanStr4SQL(data['city'])+'\t')  # city
            outfile.write(cleanStr4SQL(data['postal_code']) + '\t')  # zipcode
            outfile.write(str(data['latitude'])+'\t')  # latitude
            outfile.write(str(data['longitude'])+'\t')  # longitude
            outfile.write(str(data['stars'])+'\t')  # stars
            outfile.write(str(data['review_count'])+'\t')  # reviewcount
            outfile.write(str(data['is_open'])+'\t')  # openstatus

            categories = data["categories"].split(', ')
            outfile.write(str(categories)+'\t')  # category list

            flatatrib = flatten(data["attributes"])
            # write your own code to process attributes
            outfile.write(str(flatatrib)+'\t')

            flathours = flatten(data["hours"])
            # write your own code to process hours
            outfile.write(str(flathours)+'\t')
            outfile.write('\n')

            line = f.readline()
            count_line += 1
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


parseBusinessData()
parseUserData()
parseCheckinData()
parseTipData()
