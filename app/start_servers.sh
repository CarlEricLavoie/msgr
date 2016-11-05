kill $(ps aux | grep '_service.js' | awk '{print $2}')
cd persistence && node persistence_service.js &
cd authentication && node authentication_service.js &
cd conversation && node conversation_service.js &
cd user && node user_service.js &
