import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceInfo {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    deviceType: DeviceType;
    width: number;
}

const useDeviceType = (): DeviceInfo => {
    // Using the simpler approach you highlighted
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Determine device type based on width
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1424;
    const isDesktop = width >= 1424;

    // Get device type string
    const deviceType: DeviceType =
        isMobile ? 'mobile' :
            isTablet ? 'tablet' :
                'desktop';

    return {
        isMobile,
        isTablet,
        isDesktop,
        deviceType,
        width
    };
};

export default useDeviceType;