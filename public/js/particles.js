particlesJS('particles-js', {
    particles: {
        number: {
            value: 130,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: "#ffffff"
        },
        shape: {
            type: "circle",
            stroke: {
                width: 0,
                color: "#000000"
            }
        },
        opacity: {
            value: 1,
            random: false,
            anim: {
                enable: false,
                speed: 0,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 4,
            random: false,
            anim: {
                enable: true,
                speed: 10,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: false,
            distance: 150,
            color: "#ffffff",
            opacity: 0,
            width: 1
        },
        move: {
            enable: true,
            speed: 4,
            direction: "bottom",
            random: true,
            straight: false,
            out_mode: "out",
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: false,
                mode: "repulse"
            },
            onclick: {
                enable: false,
                mode: "push"
            },
            resize: false
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});