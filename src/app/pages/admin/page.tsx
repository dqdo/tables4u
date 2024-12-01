'use client'

import React, { Suspense, useState } from "react";
import { useRouter } from 'next/navigation';

import axios from "axios";


// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
    baseURL: 'https://xx0uqht4q7.execute-api.us-east-2.amazonaws.com/12'
});

export default function Home() {
    const [redraw, forceRedraw] = React.useState(0)
    const [restaurantList, setRestaurantList] = useState<{ id: number; name: string }[]>([]);
    const [restaurantID, setRestaurantID] = useState<number | string>("");
    const router = useRouter();

    function andRefreshDisplay() {
        forceRedraw(redraw + 1)
    }

    const handleSignout = () => {
        router.push("/..")
    };

    function retrieveRestaurants(): void {
        instance.get('/restaurants')
            .then(function (response) {
                let status = response.data.statusCode;

                if (status === 200) {
                    const restaurants = response.data.constants.map((con: any) => ({
                        id: con.restaurant_id,
                        name: con.restaurant_name,
                    }));
                    setRestaurantList(restaurants);
                    andRefreshDisplay();
                }
            })
            .catch(function (error) {
                console.error(error);
            });

    }

    function deleteRestaurant(): void {
        instance.post('/restaurants/deleted_restaurants', { restaurant_id: restaurantID })
            .then(function (response) {
                let status = response.data.statusCode;
                if (status == 200) {
                    console.log("Deleted restaurant: " + restaurantID)
                }
                andRefreshDisplay()
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    return (
        <div>
            <button className="button" onClick={retrieveRestaurants}>{"List Restaurants"}</button>
            <button className="button" onClick={handleSignout}>Sign Out</button>

            <label className="Restaurants">
                Restaurant List:
                {restaurantList.map((restaurant) => (
                    <div key={restaurant.id}>
                        {restaurant.id}: {restaurant.name}
                    </div>
                ))}
            </label>

            <label> Delete Restaurant - </label>
            id: <input type="text" className="text" value={restaurantID} onChange={(e) => {
                const value = e.target.value;
                if (value === "" || !isNaN(Number(value))) {
                    setRestaurantID(value);
                }
            }}
            />
            <button className="button" onClick={deleteRestaurant} >{"Delete Restaurant"}</button>
        </div>
    );
}