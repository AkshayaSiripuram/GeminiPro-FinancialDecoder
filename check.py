import google.generativeai as genai

genai.configure(api_key="AIzaSyBtgY3JW4rVIlq6IM2YoBAlpnO0eUTQlPE")

models = genai.list_models()
for model in models:
    print(model.name)  # List available models
