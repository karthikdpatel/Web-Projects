import requests

finhub_api_token = 'cn5ee1pr01qocjm1n64gcn5ee1pr01qocjm1n650'
polygon_api_key = "HH3zcaj76iqpWQfTe6HOb03X5xX4oJU0"

query = 'TSLA'

url = f'https://finnhub.io/api/v1/search?q={query}&token={finhub_api_token}'


response = requests.get(url)
data = response.json()

print(data)
