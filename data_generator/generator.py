import requests;
import json;
import threading;
import datetime;
import time;
from random import randint;
from random import uniform;

def postData():
    ts = time.time()+3600
    dt = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
    temp = randint(25,35);
    humidity = uniform(0.1, 0.3);
    post_data = {'temperature':temp,'humidity':humidity,'date':dt}
    set_response = (requests.post(url='http://localhost:8080/setStats', params=post_data))
    if(set_response.status_code >= 200 and set_response.status_code < 300):
        print("Connection successful.")
        print("Data sent.")
    else:
        print("Connection failed.")
        print("Data not sent.")


def getData():
    get_response = requests.get(url='http://localhost:8080/getStats')
    if (get_response.status_code >= 200 and get_response.status_code < 300):
        print("Connection successful.")
        respData = json.loads(get_response.text)
        print("Number of results: ", len(respData))
    else:
        print("Connection failed.")

def execute():
    postData()
    getData()
    threading.Timer(15, execute).start()

def main():

    execute()

if __name__ == "__main__":
    main()




