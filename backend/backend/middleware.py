from django.utils.deprecation import MiddlewareMixin

class ForceCORSHeadersMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        # Dynamically reflect the request's Origin so it works with
        # localhost, ngrok, Vercel, or any other frontend origin.
        origin = request.META.get("HTTP_ORIGIN", "*")
        response["Access-Control-Allow-Origin"] = origin
        response["Access-Control-Allow-Credentials"] = "true"
        response["Access-Control-Allow-Headers"] = "Content-Type, X-CSRFToken, Authorization"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        return response
