from flask import Flask, send_from_directory, request
import requests
from datetime import datetime, timedelta
import calendar

app = Flask(__name__)


def fnGetChartData(polygon_api_key, stock_ticker, from_date, to_date):
    recommendation_url = f"https://api.polygon.io/v2/aggs/ticker/{stock_ticker}/range/1/day/{from_date}/{to_date}?adjusted=true&sort=asc&apiKey={polygon_api_key}"
    recommendation_response = requests.get(recommendation_url)
    return recommendation_response.json()


def fnSubtractDuration():
    current_date = datetime.now()

    new_month = current_date.month - 6
    new_year = current_date.year
    while new_month < 1:
        new_month += 12
        new_year -= 1
    new_date_6_months = current_date.replace(month=new_month, year=new_year)

    new_month = current_date.month - 3
    new_year = current_date.year
    while new_month < 1:
        new_month += 12
        new_year -= 1
    new_date_3_months = current_date.replace(month=new_month, year=new_year)

    new_month = current_date.month - 1
    new_year = current_date.year
    while new_month < 1:
        new_month += 12
        new_year -= 1
    new_date_1_months = current_date.replace(month=new_month, year=new_year)

    result_date = current_date - timedelta(days=15)
    new_date_15_days = result_date.strftime('%Y-%m-%d')

    result_date = current_date - timedelta(days=7)
    new_date_7_days = result_date.strftime('%Y-%m-%d')

    current_date = current_date.strftime('%Y-%m-%d')

    return current_date, new_date_7_days, new_date_15_days, new_date_1_months, new_date_3_months, new_date_6_months


@app.route('/')
def index():
    return send_from_directory("static", "home.html")


@app.route('/home', methods=['GET'])
def home():  # put application's code here
    args = request.args
    stock_ticker = args.get('stock_ticker')
    finhub_api_token = 'cn5ee1pr01qocjm1n64gcn5ee1pr01qocjm1n650'
    polygon_api_key = "HH3zcaj76iqpWQfTe6HOb03X5xX4oJU0"
    print(stock_ticker)

    profile_url = f'https://finnhub.io/api/v1/stock/profile2?symbol={stock_ticker}&token={finhub_api_token}'
    profile_response = requests.get(profile_url)
    profile_data = profile_response.json()

    quote_data, recommendation_data, filtered_news_data, chart_data, to_date = {}, {}, [], [], ''
    flag = False

    if profile_data != {}:
        flag = True
        quote_url = f'https://finnhub.io/api/v1/quote?symbol={stock_ticker}&token={finhub_api_token}'
        quote_response = requests.get(quote_url)
        quote_data = quote_response.json()

        recommendation_url = f"https://finnhub.io/api/v1/stock/recommendation?symbol={stock_ticker}&token={finhub_api_token}"
        recommendation_response = requests.get(recommendation_url)
        recommendation_data = recommendation_response.json()
        recommendation_data = sorted(recommendation_data, key=lambda x: x['period'], reverse=True)
        recommendation_data = recommendation_data[0]

        current_date = datetime.now()
        new_month = current_date.month - 6
        new_year = current_date.year
        while new_month < 1:
            new_month += 12
            new_year -= 1
        from_date = current_date.replace(month=new_month, year=new_year)
        from_date = from_date.strftime('%Y-%m-%d')
        to_date = current_date.strftime('%Y-%m-%d')
        print(from_date)
        print(to_date)

        chart_url = f"https://api.polygon.io/v2/aggs/ticker/{stock_ticker}/range/1/day/{from_date}/{to_date}?adjusted=true&sort=asc&apiKey={polygon_api_key}"
        chart_response = requests.get(chart_url)
        chart_data = chart_response.json()

        data = []

        for i in range(len(chart_data['results'])):
            d = [chart_data['results'][i]['t'], chart_data['results'][i]['c'], chart_data['results'][i]['v']]
            data.append(d)

        chart_data = data
        print(chart_data)

        # current_date, new_date_7_days, new_date_15_days, new_date_1_months, new_date_3_months, new_date_6_months = fnSubtractDuration()
        # data_7days = fnGetChartData(polygon_api_key, stock_ticker, new_date_7_days, current_date)
        # data_15days = fnGetChartData(polygon_api_key, stock_ticker, new_date_15_days, current_date)
        # data_1month = fnGetChartData(polygon_api_key, stock_ticker, new_date_1_months, current_date)
        # data_3month = fnGetChartData(polygon_api_key, stock_ticker, new_date_3_months, current_date)
        # data_6month = fnGetChartData(polygon_api_key, stock_ticker, new_date_6_months, current_date)

        current_date = datetime.now()
        before_30_date = current_date - timedelta(days=30)
        before_30_date = before_30_date.strftime('%Y-%m-%d')
        current_date = current_date.strftime('%Y-%m-%d')
        news_url = f'https://finnhub.io/api/v1/company-news?symbol={stock_ticker}&from={before_30_date}&to={current_date}&token={finhub_api_token}'
        news_response = requests.get(news_url)
        news_data = news_response.json()

        filtered_news_data = []

        for i in range(len(news_data)):
            if len(filtered_news_data) == 5:
                break

            if (news_data[i]['image'] != '' and news_data[i]['image'] is not None) and (
                    news_data[i]['url'] != '' and news_data[i]['url'] is not None) and (
                    news_data[i]['headline'] != '' and news_data[i]['headline'] is not None) and (
                    news_data[i]['datetime'] != '' and news_data[i]['datetime'] is not None):
                json_data = {}
                json_data['image'] = news_data[i]['image']
                json_data['url'] = news_data[i]['url']
                json_data['headline'] = news_data[i]['headline']
                json_data['datetime'] = news_data[i]['datetime']
                filtered_news_data.append(json_data)
        # data_7days, data_15days, data_1month, data_3month, data_6month
    return [profile_data, quote_data, recommendation_data, filtered_news_data, chart_data, to_date, stock_ticker, flag]


if __name__ == '__main__':
    app.run(port=8080)
