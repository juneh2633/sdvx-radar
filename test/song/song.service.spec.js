const { Pool } = require("pg");
const SongService = require("../../src/api/song/song.service");
const SongRepository = require("../../src/api/song/song.repository");

describe("SongService", () => {
    let songService;
    let mockPgPool;
    let mockSongRepository;
    let mockConn;

    beforeEach(() => {
        mockPgPool = {
            connect: jest.fn(),
        };
        mockConn = {
            query: jest.fn(),
            release: jest.fn(),
        };
        mockSongRepository = {
            insertSong: jest.fn(),
            insertDifficulties: jest.fn(),
        };
        songService = new SongService(mockSongRepository, mockPgPool);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully create songs and difficulties", async () => {
        // Arrange
        const inputData = require("../../data/data");
        const level = 5;

        mockPgPool.connect.mockResolvedValue(mockConn);
        mockConn.query.mockResolvedValueOnce(); // For BEGIN
        mockConn.query.mockResolvedValueOnce(); // For COMMIT
        mockSongRepository.insertSong.mockResolvedValue();
        mockSongRepository.insertDifficulties.mockResolvedValue();

        // Act
        await songService.create(level);

        // Assert
        expect(mockPgPool.connect).toHaveBeenCalledTimes(1);
        expect(mockConn.query).toHaveBeenCalledWith("BEGIN");
        expect(mockSongRepository.insertSong).toHaveBeenCalledTimes(1);
        expect(mockSongRepository.insertSong).toHaveBeenCalledWith(inputData[0], mockConn);
        expect(mockSongRepository.insertDifficulties).toHaveBeenCalledTimes(1);
        expect(mockSongRepository.insertDifficulties).toHaveBeenCalledWith(inputData[0], inputData[0].difficulties[0], mockConn);
        expect(mockConn.query).toHaveBeenCalledWith("COMMIT");
        expect(mockConn.release).toHaveBeenCalledTimes(1);
    });

    it("should handle exceptions and rollback the transaction", async () => {
        // Arrange
        const level = 5;
        const error = new Error("Database error");

        mockPgPool.connect.mockResolvedValue(mockConn);
        mockConn.query.mockResolvedValueOnce(); // For BEGIN
        mockConn.query.mockRejectedValueOnce(error); // Simulate error during processing
        mockConn.query.mockResolvedValueOnce(); // For ROLLBACK

        // Act and Assert
        await expect(songService.create(level)).rejects.toThrow(error);
        expect(mockPgPool.connect).toHaveBeenCalledTimes(1);
        expect(mockConn.query).toHaveBeenCalledWith("BEGIN");
        expect(mockConn.query).toHaveBeenCalledWith("ROLLBACK");
        expect(mockConn.release).toHaveBeenCalledTimes(1);
    });
});
