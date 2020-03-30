/**
 * Created by haris.khalique on 2018-02-14.
 */

const debug = require("../helpers/debug")('imageuploader-middleware');
const error = require("../helpers/debug")('imageuploader-middleware:error');
const _ = require("underscore");
const directoryExists = require('directory-exists');
const mkdirp = require('mkdirp');

let fs = require('fs');
const multer = require('multer');
const util = require('util');
const uploadPath = __dirname + "/../films";
//const uploadPath = global.constants.LTF_DIR;
const Joi = require("joi");


const uploadMedia = (media, option) => {

    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            option.destination(req, (data) => {
                let destinationPath = uploadPath + data;
                //console.log("Destination path", destinationPath);
                debug(destinationPath);

                if (!directoryExists.sync(destinationPath)) {

                    mkdirp(destinationPath, (error) => {
                        //console.log("Desiutnation", error);
                        if (error) {
                            cb({
                                status: 422,
                                error_code: `ESS42204`,
                                title: `File Upload Validation Failed`,
                                detail: error
                            }, false);
                        }

                        cb(null, destinationPath);
                    })

                } else
                    cb(null, destinationPath);
            })

        },
        filename: (req, file, cb) => {

            debug("overridden: " + option.overideFileName(req));
            let overridefilename = option.overideFileName(req) || false;

            debug("overridden after line 54: " + overridefilename);

            let fileStorageName = option.fileName(req) ? option.fileName(req) : req.originalname;

            let name = file.originalname.substr(0, file.originalname.lastIndexOf('.'));
            let ext = file.originalname.substr(file.originalname.lastIndexOf('.'));

            if (overridefilename) {
                cb(null, (!_.isEmpty(fileStorageName)) ? fileStorageName + ext : file.originalname)
            } else {
                cb(null, (fileStorageName || name) + '-' + (new Date()).getTime() + ext)
            }

        }
    });

    let upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            let errosobj = {
                status: 422,
                error_code: `ESS42204`,
                title: `File Upload Validation Failed`,
                detail: `file upload: Only image files are allowed.`
            };
            // accept image only
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(errors.getError('ESS42207'), false);
            }

            cb(null, true);
        }
    });
    return upload.single(media);
};

const uploadRetakeMedia = (media, option) => {

    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            option.destination(req, (data) => {
                let destinationPath = uploadPath + data;
                if (!directoryExists.sync(destinationPath)) {
                    mkdirp(destinationPath, (error) => {
                        if (error) {
                            cb({
                                status: 422,
                                error_code: `ESS42204`,
                                title: `File Upload Validation Failed`,
                                detail: error
                            }, false);
                        }
                        cb(null, destinationPath);
                    })
                } else
                    cb(null, destinationPath);
            })
        },
        filename: (req, file, cb) => {
            option.file_name(req, (data) => {
                let ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
                cb(null, data + ext)
            })
        }
    });
    let upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            let errosobj = {
                status: 422,
                error_code: `ESS42204`,
                title: `File Upload Validation Failed`,
                detail: `file upload: Only image files are allowed.`
            };
            // accept image only
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(errors.getError('ESS42207'), false);
            }
            cb(null, true);
        }
    });
    return upload.single(media);
};

const uploadArrayMedia = (media, option) => {

    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            option.destination(req, (data) => {
                let destinationPath = uploadPath + data;
                //console.log("Destination path", destinationPath);
                debug(destinationPath);

                if (!directoryExists.sync(destinationPath)) {

                    mkdirp(destinationPath, (error) => {
                        //console.log("Desiutnation", error);
                        if (error) {
                            cb({
                                status: 422,
                                error_code: `ESS42204`,
                                title: `File Upload Validation Failed`,
                                detail: error
                            }, false);
                        }

                        cb(null, destinationPath);
                    })

                } else
                    cb(null, destinationPath);
            });

        },
        filename: (req, file, cb) => {

            debug("overridden: " + option.overideFileName(req));
            let overridefilename = option.overideFileName(req) || false;

            debug("overridden after line 54: " + overridefilename);

            let fileStorageName = option.fileName(req) ? option.fileName(req) : req.originalname;

            let name = file.originalname.substr(0, file.originalname.lastIndexOf('.'));
            let ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
            req.fileNames = req.fileNames || [];
            req.fileNames.push(fileStorageName + ext);

            if (overridefilename) {
                cb(null, (!_.isEmpty(fileStorageName)) ? fileStorageName + ext : file.originalname);
            } else {
                cb(null, (fileStorageName || name) + '-' + (new Date()).getTime() + ext);
            }

        }
    });

    let upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            let errosobj = {
                status: 422,
                error_code: `ESS42204`,
                title: `File Upload Validation Failed`,
                detail: `file upload: Only image files are allowed.`
            };
            // accept image only
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(errors.getError('ESS42207'), false);
            }

            cb(null, true);
        }
    });

    return upload.array(media);
};

const getUserId = (req, cb) => {
    cb(req.authUser.user_id);
    //    let authorizationHeader = req.get('Authorization');
    //    let accessToken = authorizationHeader.substr("Bearer".length, authorizationHeader.length).trim();
    //    redisClient.getAsync(accessToken).then((data)=> {
    //        debug('getUserId: ' + data)
    //        return cb(data);
    //    }).catch(() => {
    //        return null
    //    });
};

const getUserPath = (req, cb) => {
    cb(req.body.user_id);
};

const getRetouchFileName = (req, cb) => {
    let file_code = req.body.original_file_code;
    if (req.body.side_view != 0) {
        if (req.body.side_view === "side_view_one") {
            cb("side_view_one_" + file_code);
        } else if (req.body.side_view === "side_view_two") {
            cb("side_view_two_" + file_code);
        }
    } else {
        //count not added as per ibrahim bhai discussion
        //let count = parseInt(req.body.count_retouch) + 1;
        //cb("retouch_"+file_code +"_"+ count);
        cb("retouch_" + file_code);
    }
};

const getCroppedFileName = (req, cb) => {
    let file_code = req.body.original_file_code;
    cb("cropped_" + file_code);
};

const validations = {
    fileStorageName: Joi.compile({
        fileStorageName: Joi.string().required()
    }),
    destination: Joi.compile({
        destination: Joi.string().required()
    })
};

const uploadUserImage = (upFileName, upconfig) => {
    return uploadMedia(upFileName, {
        fileName: (req) => {
            return `${upconfig.customFileName}`;
        },
        destination: (req, cb) => {
            getUserId(req, (data) => {
                debug('destination: ' + `/users/${data}`)
                cb(`${upconfig.path}/${data}`);
            });
        },
        overideFileName: (req) => {
            return `${upconfig.overideFileName}`;
        }
    });
};

const uploadOutfitImage = (upFileName, upconfig) => {

    return uploadMedia(upFileName, {
        fileName: (req) => {

            return '';
        },
        destination: (req, cb) => {
            cb(`${upconfig.path}`);
        },
        overideFileName: (req) => {
            return `${upconfig.overideFileName}`;
        }
    });
};

const uploadMediaImage = (upFileName, upconfig) => {

    return uploadMedia(upFileName, {
        fileName: (req) => {
            try {
                let type = req.body.type;
                req.mediaName = type + "image" + Date.now();
                return req.mediaName;
            } catch (e) {
                console.log("Error", e);
                return false;
            }
        },
        destination: (req, cb) => {
            try {
                let type = req.body.type;
                upconfig.path = '/media/' + type;
                cb(`${upconfig.path}`);
            } catch (e) {
                console.log("Error1", e);
                return false;
            }
        },
        overideFileName: (req) => {
            try {
                return `${upconfig.overideFileName}`;
            } catch (e) {
                console.log("Error2", e);
                return false;
            }
        },
        allowedFile: ['jpg', 'jpeg', 'png', 'gif']
    });
};

const uploadReviewImages = (upFileName, upconfig) => {

    return uploadArrayMedia(upFileName, {
        fileName: (req) => {
            try {
                req.mediaName = "image" + Date.now();
                return req.mediaName;
            } catch (e) {
                console.log("Error", e);
                return false;
            }
        },
        destination: (req, cb) => {
            try {
                upconfig.path = '/media/review';
                cb(`${upconfig.path}`);
            } catch (e) {
                console.log("Error1", e);
                return false;
            }
        },
        overideFileName: (req) => {
            try {
                return `${upconfig.overideFileName}`;
            } catch (e) {
                console.log("Error2", e);
                return false;
            }
        },
        allowedFile: ['jpg', 'jpeg', 'png', 'gif']
    });
};

const uploadUserLook = (fieldName, upconfig) => {
    const multerS3Config = multerS3({
        s3: s3Config,
        bucket: `ssphotorepo/user_looks`,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        // metadata: function (req, file, cb) {
        //     cb(null, { fieldName: file.fieldname });
        // },
        key: function (req, file, cb) {
            let ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
            cb(null, "user_look_" + req.authUser.id + "_" + Date.now() + ext);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }

    const upload = multer({
        storage: multerS3Config,
        fileFilter: fileFilter,
        limits: {
            // fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
        }
    });

    return upload.single(fieldName);
};

const uploadUserRetouchImage = (upFileName, upconfig) => {
    return uploadRetakeMedia(upFileName, {
        file_name: (req, cb) => {
            getRetouchFileName(req, (data) => {
                cb(`${data}`);
            });
        },
        destination: (req, cb) => {
            getUserPath(req, (data) => {
                debug('destination: ' + `/users/${data}`)
                cb(`${upconfig.path}/${data}`);
            });
        },
        overideFileName: (req) => {
            return `${upconfig.overideFileName}`;
        }
    });
};

const uploadUserCalibrationImage = (upFileName, upconfig) => {
    return uploadRetakeMedia(upFileName, {
        file_name: (req, cb) => {
            cb("image" + Date.now());
        },
        destination: (req, cb) => {
            getUserPath(req, (data) => {
                debug('destination: ' + `/users/${data}`)
                cb(`${upconfig.path}/${data}`);
            });
        },
        overideFileName: (req) => {
            return `${upconfig.overideFileName}`;
        }
    });
};

const uploadFeedbackImage = (fieldName, upconfig) => {
    const multerS3Config = multerS3({
        s3: s3Config,
        bucket: `ssphotorepo/feedback`,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        // metadata: function (req, file, cb) {
        //     cb(null, { fieldName: file.fieldname });
        // },
        key: function (req, file, cb) {
            let ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
            let filename = "feedback_" + req.authUser.id + "_" + Date.now() + ext
            req.mediaName = filename
            cb(null, filename);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }

    const upload = multer({
        storage: multerS3Config,
        fileFilter: fileFilter,
        limits: {
            // fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
        }
    });

    return upload.single(fieldName);
};

module.exports = {
    uploadUserImage: uploadUserImage,
    uploadOutfitImage: uploadOutfitImage,
    uploadMediaImage: uploadMediaImage,
    uploadReviewImages: uploadReviewImages,
    uploadUserRetouchImage: uploadUserRetouchImage,
    uploadUserLook: uploadUserLook,
    uploadFeedbackImage: uploadFeedbackImage,
    uploadUserCalibrationImage:uploadUserCalibrationImage
};