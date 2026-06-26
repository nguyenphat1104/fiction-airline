workspace "Fiction Airline Reservation System" "C4 model for a fictional airline reservation platform" {

    model {

        customer = person "Customer" "A passenger who searches for flights, books tickets, and manages bookings." {
            tags "Customer"
        }

        travelAgent = person "Travel Agent" "A travel agent who books flights and manages travel on behalf of customers." {
            tags "Travel Agent"
        }

        airlineStaff = person "Airline Staff" "Airline operations and customer service staff who manage schedules, inventory, and passenger support." {
            tags "Airline Staff"
        }

        paymentProvider = softwareSystem "Payment Provider" "External payment service used to authorize and capture payments." {
            tags "External System"
        }

        flightDataProvider = softwareSystem "External Flight Data Service" "External system providing flight schedules, availability, and fare data." {
            tags "External System"
        }

        emailService = softwareSystem "Email / SMS Notification Service" "External service used to send booking confirmations and travel alerts." {
            tags "External System"
        }

        reservationSystem = softwareSystem "Fiction Airline Reservation System" "A modern airline reservation platform for searching flights, booking tickets, processing payments, and managing passenger itineraries." {

            tags "Core System"

            webApp = container "Web Application" "Allows customers and travel agents to search flights, book tickets, and manage itineraries through a browser." "React, TypeScript" {

                searchComponent = component "Flight Search UI" "Allows users to search for flights, filter results, and view available fare options." "React Component"

                bookingComponent = component "Booking Management UI" "Allows customers to create reservations, select seats, and complete checkout." "React Component"

                accountComponent = component "Customer Account UI" "Allows customers to manage profiles, booking history and traveller details." "React Component"
            }

            mobileApp = container "Mobile App" "Mobile interface for customers to search flights, book tickets, and manage reservations." "Flutter"

            api = container "Public API" "REST/GraphQL API used by clients." "Node.js / Express" {

                searchApi = component "Flight Search API" "Flight search endpoints." "Express Route"

                bookingApi = component "Booking API" "Booking endpoints." "Express Route"

                paymentApi = component "Payment API" "Payment endpoints." "Express Route"
            }

            bookingService = container "Booking Service" "Handles booking workflows, seat allocation and ticket issuance." "Spring Boot" {

                bookingOrchestration = component "Booking Orchestration" "Coordinates reservation workflows." "Spring Service"
            }

            searchService = container "Flight Search Service" "Provides search, pricing and availability." "Spring Boot" {

                availabilityComponent = component "Availability & Pricing" "Calculates fares and availability." "Spring Service"
            }

            inventoryService = container "Inventory Management Service" "Maintains seat inventory." "Spring Boot" {

                seatInventoryComponent = component "Seat Inventory Management" "Maintains inventory." "Spring Service"
            }

            paymentService = container "Payment Processing Service" "Processes payments." "Spring Boot" {

                paymentGatewayComponent = component "Payment Gateway Integration" "Calls external payment provider." "Spring Service"
            }

            notificationService = container "Notification Service" "Sends email and SMS notifications." "Node.js" {

                notificationDeliveryComponent = component "Notification Delivery" "Delivers notifications." "Node.js Service"
            }

            database = container "Reservation Database" "Stores reservations, payments and inventory." "PostgreSQL"
        }

        customer -> webApp "Searches and books flights"
        customer -> mobileApp "Searches and books flights"

        travelAgent -> webApp "Books flights for customers"

        airlineStaff -> webApp "Manages reservations"

        webApp -> api "Uses"
        mobileApp -> api "Uses"

        api -> bookingService "Booking requests"
        api -> searchService "Flight searches"
        api -> paymentService "Payments"
        api -> notificationService "Notifications"

        bookingService -> inventoryService "Checks seat inventory"
        bookingService -> paymentService "Processes payment"
        bookingService -> notificationService "Sends confirmation"

        searchService -> flightDataProvider "Gets schedules and fares"
        inventoryService -> flightDataProvider "Gets inventory updates"

        paymentService -> paymentProvider "Authorizes payments"

        notificationService -> emailService "Sends email/SMS"

        bookingService -> database "Reads/Writes"
        searchService -> database "Reads"
        inventoryService -> database "Reads/Writes"
        paymentService -> database "Writes"
        notificationService -> database "Reads"
    }

    views {

        systemContext reservationSystem {
            include *
            autolayout lr
            title "Fiction Airline Reservation System - System Context"
        }

        container reservationSystem {
            include *
            autolayout lr
            title "Fiction Airline Reservation System - Container"
        }

        component webApp {
            include *
            autolayout lr
            title "Web Application Components"
        }

        component api {
            include *
            autolayout lr
            title "API Components"
        }

        component bookingService {
            include *
            autolayout lr
            title "Booking Service Components"
        }

        component searchService {
            include *
            autolayout lr
            title "Search Service Components"
        }

        component inventoryService {
            include *
            autolayout lr
            title "Inventory Service Components"
        }

        component paymentService {
            include *
            autolayout lr
            title "Payment Service Components"
        }

        component notificationService {
            include *
            autolayout lr
            title "Notification Service Components"
        }

        styles {

            element "Person" {
                background #08427b
                color #ffffff
                shape person
            }

            element "Software System" {
                background #1168bd
                color #ffffff
            }

            element "Container" {
                background #438dd5
                color #ffffff
            }

            element "Component" {
                background #85bbf0
                color #000000
            }

            element "External System" {
                background #999999
                color #ffffff
            }
        }
    }
}