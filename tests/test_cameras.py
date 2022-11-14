import unittest
import json


class TestCameras(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Opens the cameras json file and makes the data available for the test
        functions.
        """
        with open("./deploy/cameras.json") as fp:
            cls.data = json.load(fp)
        # cls.names = [x["name"] for x in cls.data]
        cls.sensorSizes = [x["sensorSize"] for x in cls.data]

    def test_names(self):
        """Checks for duplicate camera names."""
        names = [x["name"] for x in self.data]
        self.assertEqual(len(names), len(set(names)))
        # Uncomment the line below to check for data to be sorted.
        # self.assertEqual(names, sorted(names))

    def test_sensorFormats(self):
        """Checks if the sensor format value is a string."""
        for sensorSize in self.sensorSizes:
            formats = [x["format"] for x in sensorSize]
            self.assertEqual(len(formats), len(set(formats)))
            for format_ in formats:
                self.assertIsInstance(format_, str)

    def test_sensorSizes(self):
        """Checks if the sensor size value is a list of exactly two numbers."""
        for sensorSize in self.sensorSizes:
            sizes = [x["size"] for x in sensorSize]
            for size in sizes:
                self.assertEqual(len(size), 2)
                self.assertIsInstance(size, list)
                x, y = size
                self.assertIsInstance(x, (int, float))
                self.assertIsInstance(y, (int, float))

    def test_categories(self):
        """Checks if the category value is a list"""
        categories = [x["category"] for x in self.data]
        for category in categories:
            self.assertIsInstance(category, list)

    def test_descriptions(self):
        """Checks if the description value is a string"""
        descriptions = [x["description"] for x in self.data]
        for description in descriptions:
            self.assertIsInstance(description, str)

    def test_categories(self):
        """Checks if the sources value is a list"""
        sources_list = [x["sources"] for x in self.data]
        for sources in sources_list:
            self.assertIsInstance(sources, list)

    def test_tags(self):
        """Checks if the tags value is a list"""
        tags_list = [x["tags"] for x in self.data]
        for tags in tags_list:
            self.assertIsInstance(tags, list)
