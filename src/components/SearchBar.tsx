'use client';

import React, { JSX } from 'react';
import { useState, useRef, useEffect } from 'react';
import { FaSearch, FaCar, FaMotorcycle, FaShip, FaUsers } from 'react-icons/fa';
import { MdDirectionsBoat } from 'react-icons/md';
import { EventType } from '@/types/event';

interface SearchBarProps {
  onEventTypeChange?: (types: EventType[]) => void;
}

const SearchBar = ({ onEventTypeChange }: SearchBarProps) => {
  const [isEventTypeOpen, setIsEventTypeOpen] = useState(false);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsEventTypeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const eventTypeConfig: { type: EventType; icon: JSX.Element; label: string }[] = [
    { type: 'car', icon: <FaCar className="text-lg" />, label: 'Car' },
    { type: 'bike', icon: <FaMotorcycle className="text-lg" />, label: 'Bike' },
    { type: 'boat', icon: <MdDirectionsBoat className="text-lg" />, label: 'Boat' },
    { type: 'cruise', icon: <FaShip className="text-lg" />, label: 'Cruise' },
    { type: 'meet up', icon: <FaUsers className="text-lg" />, label: 'Meet Up' },
  ];

  const handleEventTypeSelect = (type: EventType) => {
    let newSelectedTypes: EventType[];
    if (selectedEventTypes.includes(type)) {
      newSelectedTypes = selectedEventTypes.filter(t => t !== type);
    } else {
      newSelectedTypes = [...selectedEventTypes, type];
    }
    setSelectedEventTypes(newSelectedTypes);
    onEventTypeChange?.(newSelectedTypes);
  };

  const clearEventTypes = () => {
    setSelectedEventTypes([]);
    onEventTypeChange?.([]);
  };

  const getDisplayText = () => {
    if (selectedEventTypes.length === 0) return 'Event type';
    if (selectedEventTypes.length === 1) {
      return selectedEventTypes[0].charAt(0).toUpperCase() + selectedEventTypes[0].slice(1);
    }
    return `${selectedEventTypes.length} types selected`;
  };

  return (
    <div className="max-w-[850px] mx-auto relative">
      <div className="flex items-center justify-between bg-white rounded-full border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
        {/* Location */}
        <button className="flex-1 px-6 py-4 text-left hover:bg-gray-100 rounded-full">
          <div className="text-sm font-semibold">Where</div>
          <div className="text-sm text-gray-500">Search destinations</div>
        </button>

        {/* Date Range */}
        <div className="h-8 w-px bg-gray-200" />
        <button className="flex-1 px-6 py-4 text-left hover:bg-gray-100">
          <div className="text-sm font-semibold">When</div>
          <div className="text-sm text-gray-500">Add dates</div>
        </button>

        {/* Event Type */}
        <div className="h-8 w-px bg-gray-200" />
        <button 
          ref={buttonRef}
          onClick={() => setIsEventTypeOpen(!isEventTypeOpen)}
          className="flex-1 px-6 py-4 text-left hover:bg-gray-100 relative"
        >
          <div className="text-sm font-semibold">What</div>
          <div className="text-sm text-gray-500">
            {getDisplayText()}
          </div>
        </button>

        {/* Search Button */}
        <button className="ml-2 mr-2 px-4 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center">
          <FaSearch className="text-lg" />
        </button>
      </div>

      {/* Event Type Dropdown */}
      {isEventTypeOpen && (
        <div 
          ref={dropdownRef}
          className="absolute right-16 top-full mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Event Type</h3>
              {selectedEventTypes.length > 0 && (
                <button
                  onClick={clearEventTypes}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2">
              {eventTypeConfig.map(({ type, icon, label }) => (
                <button
                  key={type}
                  onClick={() => handleEventTypeSelect(type)}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-colors flex items-center justify-between ${
                    selectedEventTypes.includes(type)
                      ? 'bg-red-50 text-red-600'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {icon}
                    <span className="capitalize">{label}</span>
                  </span>
                  <div className={`w-5 h-5 border rounded ${
                    selectedEventTypes.includes(type)
                      ? 'border-red-600 bg-red-600'
                      : 'border-gray-300'
                  } flex items-center justify-center`}>
                    {selectedEventTypes.includes(type) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 