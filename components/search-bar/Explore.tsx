"use client";
import { useState } from "react";
import FetchSearchResults from "./FetchSearchResults";
import MapComponent from "../edit-profile-section/Geolocation/MapComponent";
import Image from "next/image";

interface SearchResults {
  id: string;
  name: string;
  email: string;
  bio: string;
  pfp: string;
  Latitude_Longitude_Location: number[];
  vendor_type: string;
  menus: string[];
  special_today: string;
  state: string;
  city: string;
}

export default function Explore() {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    FetchSearchResults(query).then((result) => {
      if (result) {
        setSearchResults(
          result.map((resultItem) => ({
            id: resultItem.id,
            name: resultItem.name,
            email: resultItem.email,
            bio: resultItem.bio,
            pfp: resultItem.pfp,
            Latitude_Longitude_Location: resultItem.Latitude_Longitude_Location,
            vendor_type: resultItem.vendor_type,
            menus: resultItem.menus,
            special_today: resultItem.special_today,
            state: resultItem.state,
            city: resultItem.city,
          }))
        );
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="query">Vendor Search</label>
        <input
          id="query"
          className="text-black p-1"
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search vendors by name"
        />
        <button type="submit">Enter Search</button>
      </form>
      {searchResults.length === 0 ? (
        <p>
          There were no results found for your search, please try another vendor
          name
        </p>
      ) : (
        searchResults.map((result, index) => (
          <div key={index} className="border-2 border-white rounded my-5 w-fit">
            <a href={"/" + result.name} className="w-fit">
              <div className="text-white flex flex-col">
                <div className="flex items-center">
                  <Image
                    src={result.pfp ? result.pfp : "/default-pfp.svg"}
                    alt={"Profile picture for:" + result.name}
                    width={60}
                    height={60}
                    className=""
                  />
                  <p className="mx-5">{result.name}</p>
                </div>
                <p>{result.city}, {result.state}</p>
                <p className="text-left">Cuisine: {result.vendor_type ? result.vendor_type : "Cuisine type not specified"}</p>
                {result.special_today && <p>Deal of the day: {result.special_today}</p>}
              </div>
              <div>
                {result.Latitude_Longitude_Location ? (
                  <MapComponent
                    coordinates={result.Latitude_Longitude_Location}
                  />
                ) : (
                  <p>There is no current vendor location</p>
                )}
              </div>
            </a>
          </div>
        ))
      )}
    </div>
  );
}
